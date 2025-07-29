import ConfigurationAPIs from '../api/ConfigurationAPIs';

const APIs = {
  // Editor de pagina web
  login: async (email, password, customPath) => {
    const path = customPath || 'usuario_login';
    return ConfigurationAPIs.post(path, { email, password });
  },

  createArticles: async (data, customPath) => {
    const path = customPath || 'articulo_create';
    return ConfigurationAPIs.post(path, data)
  },

  getArticles: async (data, customPath) => {
    const path = customPath || 'articulos_get';
    return ConfigurationAPIs.post(path, data)
  },

  getArticlesGlobal: async (data, customPath) => {
    const path = customPath || 'articulos_get';
    return ConfigurationAPIs.post(path, data)
  },

  getCollectionByFamily: async (familyId, customPath) => {
    const path = customPath || `get_colecciones_x_familia/${familyId}`;
    return ConfigurationAPIs.get(path)
  },

  updateArticles: async (data) => {
    const path = `update_articulo/${data.id}`;
    return ConfigurationAPIs.put(path, data)
  },

  getArticlesForVendedor: async (data, customPath) => {
    const path = customPath || 'articulos_get_for_vendedor';
    return ConfigurationAPIs.post(path, data)
  },

  getFamilies: async (id, customPath) => {
    const path = customPath || `familia_get/${id}`
    return ConfigurationAPIs.get(path)
  },

  ////////////////////////////////GRAL ///////////////////////////////////////
  CreateAny: async (data, ruta) => {
    const path = ruta;
    return ConfigurationAPIs.post(path, data)
  },
  CreateAnyPut: async (data, ruta) => {
    const path = ruta;
    return ConfigurationAPIs.put(path, data)
  },
  GetAny: async (ruta) => {
    const path = ruta;
    return ConfigurationAPIs.get(path)
  },
  deleteAny: async (ruta) => {
    const path = ruta;
    return ConfigurationAPIs.delete(path)
  },
  getTotalPriceWSignal: async (dataArticle, options = {}) => {
    const response = await fetch("http://hiplot.dyndns.org:84/api_dev/get_total", {
      method: "POST",
      body: JSON.stringify(dataArticle),
      headers: { "Content-Type": "application/json" },
      signal: options.signal, // Pasa la señal al request
    });

    return response.json();
  },
  getArticleWSignal: async (dataArticle, options = {}) => {
    const response = await fetch("http://hiplot.dyndns.org:84/api_dev/articulos_get", {
      method: "POST",
      body: JSON.stringify(dataArticle),
      headers: { "Content-Type": "application/json" },
      signal: options.signal, // Pasa la señal al request
    });

    return response.json();
  },
};

export default APIs; 