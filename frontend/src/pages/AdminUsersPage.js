import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { API_URL } from '../config';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching users with token:', token);
      const response = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Users response:', response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
      if (error.response?.status === 403) {
        navigate('/');
      }
    }
  };

  const handleRoleUpdate = async (userId, newRole, currentRole, userName) => {
    try {
      const result = await Swal.fire({
        title: 'Confirmer le changement',
        html: `Voulez-vous vraiment changer le rôle de <b>${userName}</b> en <b>${newRole}</b> ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, modifier',
        cancelButtonText: 'Annuler'
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        await axios.put(
          `${API_URL}/auth/users/${userId}/role`,
          { role: newRole },
          { headers: { Authorization: `Bearer ${token}` }}
        );
        Swal.fire(
          'Modifié!',
          'Le rôle a été mis à jour avec succès.',
          'success'
        );
        fetchUsers();
      }
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire(
        'Erreur!',
        'Une erreur est survenue lors de la mise à jour du rôle.',
        'error'
      );
    }
  };

  const handleDelete = async (userId, userName) => {
    try {
      const result = await Swal.fire({
        title: 'Êtes-vous sûr?',
        html: `Voulez-vous vraiment supprimer l'utilisateur <b>${userName}</b> ?<br>Cette action est irréversible!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire(
          'Supprimé!',
          'L\'utilisateur a été supprimé avec succès.',
          'success'
        );
        fetchUsers();
      }
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire(
        'Erreur!',
        'Une erreur est survenue lors de la suppression.',
        'error'
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary bg-gradient d-flex justify-content-between align-items-center">
          <h3 className="text-white mb-0">
            <i className="bi bi-people-fill me-2"></i>
            Gestion des Utilisateurs
          </h3>
          <span className="badge bg-light text-primary fs-6">
            Total: {users.length} utilisateurs
          </span>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                          <span className="fw-bold text-primary">
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div className="fw-bold">{user.firstName} {user.lastName}</div>
                      </div>
                    </td>
                    <td className="align-middle">{user.email}</td>
                    <td className="align-middle" style={{width: "200px"}}>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(
                          user._id,
                          e.target.value,
                          user.role,
                          `${user.firstName} ${user.lastName}`
                        )}
                        className="form-select"
                      >
                        <option value="CLIENT">Client</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="text-center align-middle">
                      <button
                        onClick={() => handleDelete(user._id, `${user.firstName} ${user.lastName}`)}
                        className="btn btn-danger"
                      >
                        <i className="bi bi-trash me-2"></i>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsersPage;