// src/components/UserViewModal.tsx
import { useEffect } from "react";
import type { User } from "../models/User";

interface Props {
  usuario: User | null;
  onClose: () => void;
}

const UserViewModal: React.FC<Props> = ({ usuario, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!usuario) return null;

  // Helper para extraer datos
  const getContacto = (tipo: string) => {
    return usuario.contactos?.find((c: any) => c.tipo === tipo)?.valor || 'No registrado';
  };

  const getCedula = () => {
    return usuario.cedula_identidad || usuario.documentos?.find(d => d.tipo === 'CEDULA')?.numero || 'No registrado';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-lg p-6 w-[480px] shadow-2xl overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Detalles del Usuario</h2>

        <div className="space-y-4">
          {/* Información básica */}
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium text-gray-900 mb-2">Información Personal</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">ID:</span>
                <p className="font-medium">{usuario.id || usuario.usuario_id}</p>
              </div>
              <div>
                <span className="text-gray-600">Usuario:</span>
                <p className="font-medium">{usuario.username}</p>
              </div>
              <div>
                <span className="text-gray-600">Nombre:</span>
                <p className="font-medium">{usuario.persona?.nombre || usuario.nombre} {usuario.persona?.apellido_paterno || usuario.apellido_paterno}</p>
              </div>
              {usuario.persona?.apellido_materno && (
                <div>
                  <span className="text-gray-600">Apellido Materno:</span>
                  <p className="font-medium">{usuario.persona.apellido_materno}</p>
                </div>
              )}
              <div>
                <span className="text-gray-600">Género:</span>
                <p className="font-medium">
                  {usuario.persona?.genero === 'M' ? 'Masculino' : 
                   usuario.persona?.genero === 'F' ? 'Femenino' : 
                   usuario.persona?.genero === 'O' ? 'Otro' : 'No registrado'}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Roles:</span>
                <p className="font-medium">{usuario.roles?.join(', ') || 'Sin roles'}</p>
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-medium text-gray-900 mb-2">Información de Contacto</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Email:</span>
                <p className="font-medium">{getContacto('EMAIL')}</p>
              </div>
              <div>
                <span className="text-gray-600">Teléfono:</span>
                <p className="font-medium">{getContacto('TELEFONO')}</p>
              </div>
              <div>
                <span className="text-gray-600">Cédula:</span>
                <p className="font-medium">{getCedula()}</p>
              </div>
            </div>
          </div>

          {/* Foto si existe */}
          {usuario.persona?.foto_url && (
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-medium text-gray-900 mb-2">Foto</h3>
              <div className="flex justify-center">
                <img 
                  src={usuario.persona.foto_url} 
                  alt="Foto de perfil" 
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserViewModal;