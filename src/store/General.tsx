import { create } from 'zustand';


export const UserKey = 'user';

interface UserStore {
  url_img: string; // Añadir url_img aquí
// Añadir acción para actualizar url_img
}

const useUserStore = create<UserStore>((set) => ({
  url_img: 'http://hiplot.dyndns.org:84/', // URL base de la imagen

}));

export default useUserStore;
