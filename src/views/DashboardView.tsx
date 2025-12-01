// src/views/DashboardView.tsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { User } from "../models/User";
import UserTable from "../components/UserTable";
import UserCreateModal from "../components/UserCreateModal";
import UserEditModal from "../components/UserEditModal";
import UserViewModal from "../components/UserViewModal";
import ProfileModal from "../components/ProfileModal";
import { useUserViewModel } from "../viewmodels/useUserViewModel";
import { useAuth } from "../context/AuthContext";
import { viewsPermissions, Role } from "../types/permisos";
import { s } from "framer-motion/client";


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

  const { user, logout, setUser } = useAuth();
  const userRoles: Role[] = user?.roles || [];



  //constrains para filtros
  const [filterName, setFilterName] = useState("");
  const [filterUsername, setFilterUsername] = useState("");
  const [filterRole, setFilterRole] = useState("");




  const allowedViews = viewsPermissions.filter(v =>
    v.rolesAllowed.some(role => userRoles.includes(role))
  );

  const { usuarios, loading, fetchUsuarios, addUsuario, removeUsuario, editUsuario } =
    useUserViewModel();

  useEffect(() => {
    if (userRoles.length) fetchUsuarios();
  }, [userRoles]);

  const handleDelete = async (id: number) => {
    setConfirmDeleteId(id);
    
  };

  const confirmDelete = async () => {
  if (confirmDeleteId !== null) {
    await removeUsuario(confirmDeleteId);
    setConfirmDeleteId(null); // cerrar modal
  }
};

const cancelDelete = () => {
  setConfirmDeleteId(null); // cerrar modal
};

  const handleCreate = async (newUser: any) => {
    try {
      await addUsuario(newUser);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  const handleEdit = (usuario: User) => {
    setUsuarioEditando(usuario);
    setShowEditModal(true);
  };

  const handleUpdateUsuario = async (updatedUser: User) => {
    await editUsuario(updatedUser.usuario_id, updatedUser);
    setShowEditModal(false);
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


  //Función para abrir el modal y cerrar el menú automáticamente
  const openCreateModal = () => {
    setMenuOpen(false); // Cerrar menú
    setShowCreateModal(true); // Abrir modal
  };

  const handleLogout = () => {
    logout(); // limpiar token/contexto
    window.location.reload(); // refresca la app

  };

  // filtros
   const filteredUsuarios = usuarios.filter((u) => {
    const fullName = `${u.nombre} ${u.apellido_paterno || ""} ${u.apellido_materno || ""}`.toLowerCase();
    const username = u.username.toLowerCase();
    const roles = u.roles?.map(r => r.rol.nombre.toLowerCase()) || [];

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
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out shadow-lg p-6 z-[1050]`}
        >
          <h2
            className="text-xl font-bold mb-6 cursor-pointer hover:text-primary text-center"
            onClick={() => setMenuOpen(false)}
          >
            Menú
          </h2>
          <ul className="space-y-3 ml-2">
            {allowedViews.map(view => (
              <li key={view.key}>
                <button
                  onClick={() => setActiveView(view.key)}
                  className="hover:text-blue-400 transition-colors"
                >
                  {view.name}
                </button>
              </li>
            ))}
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
            Perfil ▼
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-3 space-y-2 z-[1050]">
              <button className="block hover:text-primary" onClick={openProfileModal}>Mi perfil</button>
              {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
              <button className="block hover:text-primary">Configuración</button>
              <button className="block hover:text-red-500" onClick={handleLogout}>Cerrar sesión</button>
            </div>
          )}
        </div>
      )}



      {/* Vistas */}
      {activeView === "mapa" && (
        <MapContainer center={[-16.5, -68.15]} zoom={13} className="w-full h-full z-0">
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
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={openCreateModal} 
            >
              + Crear Usuario
            </button>
          </div>
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
    <option value="admin">Admin</option>
    <option value="user">Usuario</option>
    {/* Agrega los roles que tengas en tu backend */}
  </select>
</div>

          {loading ? (
            <p>Cargando usuarios...</p>
          ) : (
            <UserTable
          
              usuarios={filteredUsuarios}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
            
          )}
          {usuarioViendo && (
            <UserViewModal
              usuario={usuarioViendo}
              onClose={() => setUsuarioViendo(null)}
            />
          )}
          {showCreateModal && (
            <UserCreateModal
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
      )
      
      }
      {/* Modal de confirmación de eliminación */}
      {/* Modal de Confirmación para eliminar usuario */}
{confirmDeleteId !== null && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
    <div className="bg-white rounded-lg p-6 w-80 shadow-xl text-center">
      <svg
        className="w-12 h-12 mx-auto text-yellow-500 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M4.93 4.93a10 10 0 0114.14 14.14M9.17 9.17a4 4 0 015.66 5.66"
        />
      </svg>
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

    </div>
  );
}
