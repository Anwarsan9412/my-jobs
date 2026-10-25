import axios from 'axios';

const API = 'http://localhost:5000/api/intransits';

export const intransitServices = {
    getAll: () => axios.get(API).then(res => res.data),
    create: (data)=> axios.post(API, data).then(res => res.data),
    update: (id, data)=> axios.put(`${API}/${id}`, data),
    delete: (id) => axios.delete(`${API}/${id}`),


    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axios.post(`${API}/upload`, formData).then(res => res.data);
    }
};