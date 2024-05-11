import axios from 'axios';
import { Request, Response } from 'express';
import FormData from 'form-data';
import fs from 'fs';
//import AppError from '../errors/AppError';

const sessionToken = 'j25gpkkkt22tod7ar7sdv8oa85';
const appToken = process.env.GLPI_APP_TOKEN;

const axiosInstance = axios.create({
  baseURL: 'http://localhost/glpi/apirest.php',
  headers: {
    'Content-Type': 'application/json',
    'Session-Token': sessionToken,
    'App-Token': appToken,
  },
});


export const createTicketGLPI = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, categoryId, userId, groupId, description } = req.body;
    const file = req.file;

    console.log('Arquivo recebido:', file);

    let documentId;
    if (file) {
      const documentFormData = new FormData();
      const fileBuffer = fs.readFileSync(file.path);
      documentFormData.append('uploadManifest', JSON.stringify({
        input: {
          name: file.originalname,
          _filename: [file.filename],
        },
      }));
      documentFormData.append('filename', fileBuffer, { filename: file.originalname });

      console.log('FormData:', documentFormData);

      const documentResponse = await axiosInstance.post('/Document', documentFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...documentFormData.getHeaders(),
        },
      });

      console.log('Resposta da API:', documentResponse.data); 

      documentId = documentResponse.data.id;
    } else {
      console.log('Nenhum arquivo recebido');
    }
    const response = await axiosInstance.post('/Ticket', {
      input: {
        name: title,
        itilcategories_id: categoryId,
        users_id_recipient: userId,
        _groups_id_requester: groupId,
        content: description,
        _documents_id: documentId,
      },
    });

    return res.json({ ticketId: response.data.id, documentId });
  } catch (error) {
    console.error('Erro ao criar ticket no GLPI:', error.message);
    return res.status(500).json({ error: 'Erro ao criar ticket no GLPI' });
  }
};

export const fetchTicketFromGLPI = async (req: Request, res: Response): Promise<Response> => {
  const ticketId = req.params.ticketId;

  try {
    const response = await axiosInstance.get(`/Ticket/${ticketId}`);
    const ticketData = response.data;
    
    return res.json({ data: ticketData });
  } catch (error) {
    console.error('Erro ao obter informações do ticket do GLPI:', error.message);
    return res.status(500).json({ error: 'Erro ao obter informações do ticket do GLPI' });
  }
};


export const fetchITILCategoryFromGLPI = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response = await axiosInstance.get('/ITILCategory');
    const tipo = req.query.tipo;
    if (tipo) {
      const filteredData = response.data.filter((category: any) => {
        if (tipo === '1') {
          return category.is_incident === 1;
        } else if (tipo === '2') {
          return category.is_request === 1;
        }
        return true;
      });
      return res.json({ data: filteredData });
    }

    console.log('[GLPI]consultou grupos');
    return res.json({ data: response.data });
  } catch (error) {
    console.error('Erro ao obter dados do GLPI:', error.message);
    return res.status(500).json({ error: 'Erro ao obter dados do GLPI' });
  }
};

export const fetchGLPIUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response = await axiosInstance.get('/User');
    console.log('[GLPI]consultou users');
    return res.json({ data: response.data });
  } catch (error) {
    console.error('Erro ao obter dados do GLPI:', error.message);
    return res.status(500).json({ error: 'Erro ao obter dados do GLPI' });
  }
};

export const fetchGLPIGroups = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response = await axiosInstance.get('/Group');
    console.log('[GLPI]consultou grupos');
    return res.json({ data: response.data });
  } catch (error) {
    console.error('Erro ao obter dados do GLPI:', error.message);
    return res.status(500).json({ error: 'Erro ao obter dados do GLPI' });
  }
};
/*export const fetchITILCategoryFromGLPI = async ( req: Request, res: Response ): Promise<Response> => {

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        session_token: sessionToken,
        app_token: appToken,
      },
    };

    const response = await axios.get(apiUrl, config);
    const data = response.data;

    return res.json({ data });
  } catch (error) {
    console.error('Erro ao obter dados do GLPI:', error.message);
    return res.status(500).json({ error: 'Erro ao obter dados do GLPI' });
  }
};*/
