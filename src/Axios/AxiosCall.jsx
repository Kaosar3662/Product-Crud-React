import axios from 'axios';
import { createRoot } from 'react-dom/client';
import Loading from '../Components/Loading';
import Toaster from '../Components/Toaster';

let loaderRoot = document.getElementById('loader-root');
if (!loaderRoot) {
  loaderRoot = document.createElement('div');
  loaderRoot.id = 'loader-root';
  document.body.appendChild(loaderRoot);
}
let loaderRootContainer = loaderRoot.__reactRootContainer;
if (!loaderRootContainer) {
  loaderRootContainer = createRoot(loaderRoot);
  loaderRoot.__reactRootContainer = loaderRootContainer;
}

let toasterRoot = document.getElementById('toaster-root');
if (!toasterRoot) {
  toasterRoot = document.createElement('div');
  toasterRoot.id = 'toaster-root';
  document.body.appendChild(toasterRoot);
}
let toasterRootContainer = toasterRoot.__reactRootContainer;
if (!toasterRootContainer) {
  toasterRootContainer = createRoot(toasterRoot);
  toasterRoot.__reactRootContainer = toasterRootContainer;
}

let loaderVisible = false;
let currentToaster = { message: '', type: 'info' };

const showLoader = () => {
  loaderVisible = true;
  renderLoader();
};
const hideLoader = () => {
  loaderVisible = false;
  renderLoader();
};

const showToaster = (message, type = 'info') => {
  currentToaster = { message, type };
  renderToaster();
};

const renderLoader = () => {
  loaderRootContainer.render(<Loading loading={loaderVisible} />);
};

const renderToaster = () => {
  toasterRootContainer.render(<Toaster message={currentToaster.message} type={currentToaster.type} />);
};

const getAuthToken = () => {
  const auth = localStorage.getItem('auth');
  if (!auth) return null;
  const LS = JSON.parse(auth);
  return LS.token || null;
};

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) delete config.headers['Content-Type'];
  else config.headers['Content-Type'] = 'application/json';
  return config;
});

const apiService = {
  request: async (method, endpoint, data = null) => {
    showLoader();
    try {
      const response = await api({ method, url: endpoint, data });
      const resData = response.data;

      showToaster(resData.message || '', resData.success ? 'success' : 'error');
      return resData;

    } catch (e) {
      if (e.response?.data?.message) {
        showToaster(e.response.data.message, 'error');
      }
      return null;
    } finally {
      hideLoader();
    }
  },

  getAllProducts: async ({ search = '', limit = 10, offset = 0 } = {}) => {
    return await apiService.request('get', '/products/all', { params: { search, limit, offset } });
  },
};

export default apiService;
