// src/views/DashboardView.tsx - VERSIÓN FINAL
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { User } from '../models/User';
import UserTable from "../components/UserTable";
import UserCreateModal from "../components/UserCreateModal";
import UserEditModal from "../components/UserEditModal";
import UserViewModal from "../components/UserViewModal";
import ProfileModal from "../components/ProfileModal";
import { useUserViewModel } from "../viewmodels/useUserViewModel";
import { useAuth } from "../context/AuthContext";

export default function DashboardView() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<string>("mapa");
  const [usuarioViendo, setUsuarioViendo] = useState<User | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const { user, logout } = useAuth();

  // 🔥 CONTROL DE EJECUCIONES
  const fetchCountRef = useRef(0);
  const MAX_FETCHES = 3;

  // 🔥 NORMALIZAR ROLES - Asegurar MAYÚSCULAS
  const userRoles: string[] = (user?.roles || []).map((role: any) => {
    if (typeof role === 'string') {
      return role.toUpperCase();
    }
    return String(role).toUpperCase();
  });

  // 🔥 TEMPORAL: Usar permisos hardcodeados
  const viewsPermissionsTemp = [
    {
      key: 'mapa',
      name: 'Mapa',
      rolesAllowed: ['ADMIN', 'CONDUCTOR', 'SUPERVISOR'],
    },
    {
      key: 'usuarios',
      name: 'Usuarios',
      rolesAllowed: ['ADMIN'],
    },
    {
      key: 'vehiculos',
      name: 'Vehículos',
      rolesAllowed: ['ADMIN', 'SUPERVISOR'],
    },
    {
      key: 'rutas',
      name: 'Rutas',
      rolesAllowed: ['ADMIN', 'SUPERVISOR'],
    },
    {
      key: 'reportes',
      name: 'Reportes',
      rolesAllowed: ['ADMIN'],
    },
  ];

  // 🔥 Filtrar vistas permitidas
  const allowedViews = viewsPermissionsTemp.filter(v =>
    v.rolesAllowed.some(role => userRoles.includes(role.toUpperCase()))
  );

  // Filtros
  const [filterName, setFilterName] = useState("");
  const [filterUsername, setFilterUsername] = useState("");
  const [filterRole, setFilterRole] = useState("");

  // 🔥 HOOK PARA USUARIOS - CON CONTROL
  const { usuarios, loading, fetchUsuarios, addUsuario, removeUsuario, editUsuario } =
    useUserViewModel();

  // 🔥 🔥 🔥 useEffect CORREGIDO (sin NodeJS.Timeout)
  useEffect(() => {
    console.log('🚨 DEBUG: useEffect ejecutándose');
    
    // 🔥 SI YA HAY USUARIOS, NO HACER NADA
    if (usuarios.length > 0) {
      console.log('🚨 DEBUG: Ya tiene usuarios, no hacer nada');
      return;
    }
    
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout>; // 🔥 CORREGIDO
    
    const loadUsuarios = async () => {
      console.log('🚨 DEBUG: loadUsuarios() llamado');
      
      if (!isMounted) return;
      if (!userRoles.includes('ADMIN')) return;
      if (fetchCountRef.current >= MAX_FETCHES) return;
      if (loading) return;
      
      fetchCountRef.current++;
      console.log(`🚨 DEBUG: Ejecutando intento ${fetchCountRef.current}/${MAX_FETCHES}`);
      
      try {
        await fetchUsuarios();
        console.log('🚨 DEBUG: fetchUsuarios() completado');
      } catch (error) {
        console.error('Error cargando usuarios:', error);
      }
    };
    
    if (userRoles.includes('ADMIN')) {
      console.log('🚨 DEBUG: Programando carga...');
      timeoutId = setTimeout(loadUsuarios, 2000);
    }
    
    return () => {
      console.log('🚨 DEBUG: Cleanup ejecutado');
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [userRoles, usuarios.length, loading, fetchUsuarios, MAX_FETCHES]);

  // 🔥 HANDLERS
  const handleDelete = async (id: number) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (confirmDeleteId !== null) {
      try {
        await removeUsuario(confirmDeleteId);
        setConfirmDeleteId(null);
        // 🔥 Recargar usuarios después de eliminar
        await fetchUsuarios();
      } catch (error) {
        console.error("Error eliminando usuario:", error);
      }
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleCreate = async (newUser: any) => {
    try {
      const usuarioData = {
        ...newUser,
        roles: Array.isArray(newUser.roles) ? newUser.roles : [newUser.roles]
      };
      await addUsuario(usuarioData);
      setShowCreateModal(false);
      // 🔥 Recargar usuarios después de crear
      await fetchUsuarios();
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  const handleEdit = (usuario: User) => {
    setUsuarioEditando(usuario);
    setShowEditModal(true);
  };

  const handleUpdateUsuario = async (updatedUser: User) => {
    try {
      await editUsuario(updatedUser.id || updatedUser.usuario_id!, updatedUser);
      setShowEditModal(false);
      // 🔥 Recargar usuarios después de editar
      await fetchUsuarios();
    } catch (error) {
      console.error("Error actualizando usuario:", error);
    }
  };

  const handleView = (usuario: User) => {
    setUsuarioViendo(usuario);
  };

  const openProfileModal = () => {
    setMenuOpen(false);
    setShowProfileModal(true);
  };

  const MapResize = ({ activeView }: { activeView: string }) => {
    const map = useMap();
    useEffect(() => {
      setTimeout(() => map.invalidateSize(), 300);
    }, [activeView, map]);
    return null;
  };

  const openCreateModal = () => {
    setMenuOpen(false);
    setShowCreateModal(true);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // 🔥 Filtros
  const filteredUsuarios = usuarios.filter((u) => {
    const fullName = `${u.nombre} ${u.apellido_paterno || ""} ${u.apellido_materno || ""}`.toLowerCase();
    const username = u.username.toLowerCase();
    const roles = u.roles || [];

    const nameMatch = fullName.includes(filterName.toLowerCase());
    const usernameMatch = username.includes(filterUsername.toLowerCase());
    const roleMatch = filterRole ? roles.includes(filterRole.toLowerCase()) : true;

    return nameMatch && usernameMatch && roleMatch;
  });

  return (
    <div className="relative w-full h-screen bg-background-light dark:bg-background-dark">
      {/* Botón menú */}
      <div className="absolute top-4 left-4 z-[1000]">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-black transition-all"
        >
          ☰
        </button>

        {/* Sidebar */}
        <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-lg p-6 z-[1050]`}>
          
          <h2 className="text-xl font-bold mb-6 text-center">Menú</h2>
          
          {/* 🔥 INFO DE DEBUG MEJORADA */}
          <div className="mb-4 p-3 bg-gray-800 rounded">
            <p className="text-sm mb-1"> <strong>{user?.username || 'Sin usuario'}</strong></p>
            <p className="text-sm mb-1"> <strong>{userRoles.join(', ') || 'Sin roles'}</strong></p>
            <p className="text-sm mb-1"> <strong>{allowedViews.length} vistas</strong></p>
            <p className="text-sm mb-1"> <strong>{usuarios.length} usuarios</strong></p>
            <p className="text-sm"> <strong>{fetchCountRef.current}/{MAX_FETCHES} intentos</strong></p>
          </div>
          
          <ul className="space-y-3">
            {allowedViews.map(view => (
              <li key={view.key}>
                <button
                  onClick={() => {
                    console.log(`🔍 Cambiando a vista: ${view.key} (${view.name})`);
                    setActiveView(view.key);
                    setMenuOpen(false);
                  }}
                  className={`w-full text-left py-3 px-4 rounded-lg transition-all flex justify-between items-center ${
                    activeView === view.key 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'hover:bg-gray-800 hover:text-blue-400 border border-gray-700'
                  }`}
                >
                  <span>{view.name}</span>
                  {view.key === 'usuarios' && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      userRoles.includes('ADMIN') ? 'bg-green-700' : 'bg-red-700'
                    }`}>
                      {userRoles.includes('ADMIN') ? '👑 ADMIN' : '🚫'}
                    </span>
                  )}
                </button>
              </li>
            ))}
            
            {/* 🔥 BOTÓN DE CARGA MANUAL */}
            {userRoles.includes('ADMIN') && (
              <li className="mt-4">
                <button
                  onClick={async () => {
                    if (fetchCountRef.current < MAX_FETCHES) {
                      fetchCountRef.current++;
                      console.log(`🔄 Carga manual #${fetchCountRef.current}`);
                      try {
                        await fetchUsuarios();
                      } catch (err) {
                        console.error('Error carga manual:', err);
                      }
                    } else {
                      console.log('🛑 Máximo de intentos alcanzado');
                    }
                  }}
                  className="w-full py-2 bg-purple-700 hover:bg-purple-600 rounded text-sm flex items-center justify-center gap-2"
                  disabled={fetchCountRef.current >= MAX_FETCHES || loading}
                >
                  {loading ? '⏳ Cargando...' : '🔄 Recargar Usuarios'}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Dropdown perfil */}
      {activeView === "mapa" && (
        <div className="absolute top-4 right-4 z-[1000]">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-4 py-2 bg-primary text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all"
          >
            {user?.persona?.nombre || user?.username || "Perfil"} ▼
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-3 space-y-2 z-[1050]">
              <button 
                className="block hover:text-primary w-full text-left p-2" 
                onClick={openProfileModal}
              >
                Mi perfil
              </button>
              <button className="block hover:text-primary w-full text-left p-2">
                Configuración
              </button>
              <button 
                className="block hover:text-red-500 w-full text-left p-2" 
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}

      {/* Vistas */}
      {activeView === "mapa" && (
        <MapContainer 
          center={[-16.5, -68.15]} 
          zoom={13} 
          className="w-full h-full z-0"
          style={{ height: '100vh', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapResize activeView={activeView} />
        </MapContainer>
      )}

      {activeView === "usuarios" && allowedViews.some(v => v.key === "usuarios") && (
        <div className="absolute left-64 top-0 w-[calc(100%-16rem)] h-full bg-gray-100 dark:bg-gray-100 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Usuarios</h2>
            <div className="flex gap-2">
              {userRoles.includes('ADMIN') && (
                <>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={openCreateModal} 
                  >
                    + Crear Usuario
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={async () => {
                      if (fetchCountRef.current < MAX_FETCHES) {
                        fetchCountRef.current++;
                        try {
                          await fetchUsuarios();
                        } catch (error) {
                          console.error('Error recargando:', error);
                        }
                      }
                    }}
                    disabled={fetchCountRef.current >= MAX_FETCHES || loading}
                  >
                    {loading ? '⏳' : '🔄'}
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Filtros */}
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Filtrar por nombre"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="px-3 py-2 border rounded w-1/3"
            />
            <input
              type="text"
              placeholder="Filtrar por username"
              value={filterUsername}
              onChange={(e) => setFilterUsername(e.target.value)}
              className="px-3 py-2 border rounded w-1/3"
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border rounded w-1/3"
            >
              <option value="">Todos los roles</option>
              <option value="ADMIN">Admin</option>
              <option value="CONDUCTOR">Conductor</option>
              <option value="SUPERVISOR">Supervisor</option>
            </select>
          </div>

          {/* Tabla de usuarios */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Cargando usuarios...</p>
              <p className="text-sm text-gray-500">Intento {fetchCountRef.current} de {MAX_FETCHES}</p>
            </div>
          ) : (
            <>
              <UserTable
                usuarios={filteredUsuarios}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
              
              {filteredUsuarios.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron usuarios
                  {filterName || filterUsername || filterRole ? ' con los filtros aplicados' : ''}
                  <div className="mt-2">
                    <button
                      onClick={async () => {
                        if (fetchCountRef.current < MAX_FETCHES) {
                          fetchCountRef.current++;
                          try {
                            await fetchUsuarios();
                          } catch (error) {
                            console.error('Error recargando:', error);
                          }
                        }
                      }}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Intentar cargar de nuevo
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* 🔥 MODALES - TODOS DEBEN APARECER */}
          {usuarioViendo && (
            <UserViewModal
              usuario={usuarioViendo}
              onClose={() => setUsuarioViendo(null)}
            />
          )}
          
          {showCreateModal && (
            <UserCreateModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onCreate={handleCreate}
            />
          )}

          {showEditModal && usuarioEditando && (
            <UserEditModal
              usuario={usuarioEditando}
              onClose={() => setShowEditModal(false)}
              onEdit={handleUpdateUsuario}
            />
          )}
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-lg p-6 w-80 shadow-xl text-center">
            <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
            <p className="mb-4 text-gray-700">¿Seguro que deseas eliminar este usuario?</p>
            <div className="flex justify-around">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de perfil */}
      {showProfileModal && user && (
        <ProfileModal
          usuario={user}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}