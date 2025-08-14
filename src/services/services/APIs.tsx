import ConfigurationAPIs from '../api/ConfigurationAPIs';

const APIs = {



  // Editor de pagina web
  login: async (email: string, password: string, customPath?: string) => {
    const path = customPath || 'usuario_login';
    return ConfigurationAPIs.post(path, { email, password });
  },

  createArticles: async (data: any, customPath?: string) => {
    const path = customPath || 'articulo_create';
    return ConfigurationAPIs.post(path, data)
  },

 

  createPage: async (data, customPath) => {
    const path = customPath || 'pagina_cliente/create';
    return ConfigurationAPIs.post(path, data)
  },

  updatePage: async (data, customPath) => {
    const path = customPath || 'pagina_cliente/updatePagina';
    return ConfigurationAPIs.post(path, data)
  },
  
  getPage: async (id: string) => {
    const path = `pagina_cliente/get/${id}`;
    return ConfigurationAPIs.get(path)
  },


  getCompaniesXUsers: async (id: number, customPath?: string) => {
    const path = customPath || `get_empresas_x_usuario/${id}`;
    return ConfigurationAPIs.get(path);
  },

  getBranchOfficesXCompanies: async ( empresa_id : number, id_usuario : number, customPath?: string) => {
    const path = customPath || `get_sucursal_x_empresa/${empresa_id}/${id_usuario}`
    return ConfigurationAPIs.get(path)
  },







  getArticles: async (data: any, customPath?: string) => {
    const path = customPath || 'articulos_get';
    return ConfigurationAPIs.post(path, data)
  },

  getArticlesGlobal: async (data: any, customPath?: string) => {
    const path = customPath || 'articulos_get';
    return ConfigurationAPIs.post(path, data)
  },

  


  getCollectionByFamily: async (familyId: number, customPath?: string) => {
    const path = customPath || `get_colecciones_x_familia/${familyId}`;
    return ConfigurationAPIs.get(path)
  },

  updateArticles: async (data: any) => {
    const path = `update_articulo/${data.id}`;
    return ConfigurationAPIs.put(path, data)
  },



  getArticlesForVendedor: async (data: any, customPath?: string) => {
    const path = customPath || 'articulos_get_for_vendedor';
    return ConfigurationAPIs.post(path, data)
  },

  getFamilies: async (id: number, customPath?: string) => {
    const path = customPath || `familia_get/${id}`
    return ConfigurationAPIs.get(path)
  },

  // APIs para empresas y sucursales
  getEmpresas: async (customPath?: string) => {
    const path = customPath || 'empresas_get';
    return ConfigurationAPIs.get(path)
  },

  getSucursales: async (empresaId: number, customPath?: string) => {
    const path = customPath || `sucursales_get/${empresaId}`;
    return ConfigurationAPIs.get(path)
  },

  ////////////////////////////////GRAL ///////////////////////////////////////
  CreateAny: async (data: any, ruta: string) => {
    const path = ruta;
    return ConfigurationAPIs.post(path, data)
  },
  CreateAnyPut: async (data: any, ruta: string) => {
    const path = ruta;
    return ConfigurationAPIs.put(path, data)
  },
  GetAny: async (ruta: string) => {
    const path = ruta;
    return ConfigurationAPIs.get(path)
  },
  deleteAny: async (ruta: string) => {
    const path = ruta;
    return ConfigurationAPIs.delete(path)
  },
  getTotalPriceWSignal: async (dataArticle: any, options: { signal?: AbortSignal } = {}) => {
    const response = await fetch("http://hiplot.dyndns.org:84/api_dev/get_total", {
      method: "POST",
      body: JSON.stringify(dataArticle),
      headers: { "Content-Type": "application/json" },
      signal: options.signal, // Pasa la señal al request
    });

    return response.json();
  },
  getArticleWSignal: async (dataArticle: any, options: { signal?: AbortSignal } = {}) => {
    const response = await fetch("http://hiplot.dyndns.org:84/api_dev/articulos_get", {
      method: "POST",
      body: JSON.stringify(dataArticle),
      headers: { "Content-Type": "application/json" },
      signal: options.signal, // Pasa la señal al request
    });

    return response.json();
  },







  /////////////////////////////////////////////////////// Colleciones ////////////////////////////////////////////////////////////////////////
}




export default APIs;



