import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUserProfile, updateUserProfile } from '../services/authService';
import Swal from 'sweetalert2';

function ProfilePage() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    phone: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      if (response.data.dateOfBirth) {
        response.data.dateOfBirth = response.data.dateOfBirth.split('T')[0];
      }
      setProfile(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement du profil');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Confirmation dialog before updating
    const result = await Swal.fire({
      title: 'Confirmer la mise à jour',
      text: "Voulez-vous enregistrer ces modifications?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, mettre à jour',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        const response = await updateUserProfile(profile);
        if (response.data) {
          const updatedData = response.data.user || response.data;
          if (updatedData.dateOfBirth) {
            updatedData.dateOfBirth = updatedData.dateOfBirth.split('T')[0];
          }
          setProfile(updatedData);

          await Swal.fire({
            icon: 'success',
            title: 'Succès!',
            text: 'Votre profil a été mis à jour avec succès',
            showConfirmButton: false,
            timer: 1500
          });
        }
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour',
          confirmButtonColor: '#d33'
        });
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Mon Profil</h2>
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Prénom</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.firstName || ''}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Nom</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.lastName || ''}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={profile.email}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date de naissance</label>
                  <input
                    type="date"
                    className="form-control"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Mettre à jour le profil
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;