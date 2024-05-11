import React, { useEffect, useState } from 'react';
import axios from 'axios';



import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Drawer from "@material-ui/core/Drawer";
import Link from "@material-ui/core/Link";
import InputLabel from "@material-ui/core/InputLabel";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { toast } from 'react-toastify';


import { i18n } from "../../translate/i18n";

import ContactModal from "../ContactModal";
import ContactDrawerSkeleton from "../ContactDrawerSkeleton";
import MarkdownWrapper from "../MarkdownWrapper";

const drawerWidth = 320;


const initialState = {
	title: '',
	categoryId: '',
	userId: '',
	groupId: '',
	description: '',
	file: null,
};


const useStyles = makeStyles(theme => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
		display: "flex",
		borderTop: "1px solid rgba(0, 0, 0, 0.12)",
		borderRight: "1px solid rgba(0, 0, 0, 0.12)",
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
		borderTopRightRadius: 4,
		borderBottomRightRadius: 4,
	},
	header: {
		display: "flex",
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
		backgroundColor: theme.palette.contactdrawer, 
		alignItems: "center",
		padding: theme.spacing(0, 1),
		minHeight: "73px",
		justifyContent: "flex-start",
	},
	content: {
		display: "flex",
		backgroundColor: theme.palette.contactdrawer,
		flexDirection: "column",
		padding: "8px 0px 8px 8px",
		height: "100%",
		overflowY: "scroll",
		...theme.scrollbarStyles,
	},

	contactAvatar: {
		margin: 15,
		width: 100,
		height: 100,
	},

	contactHeader: {
		display: "flex",
		padding: 8,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		"& > *": {
			margin: 4,
		},
	},

	contactDetails: {
		marginTop: 8,
		padding: 8,
		display: "flex",
		flexDirection: "column",
	},
	contactExtraInfo: {
		marginTop: 4,
		padding: 6,
	},
}));



const ContactDrawer = ({ open, handleDrawerClose, contact, ticket, loading }) => {
	const classes = useStyles();

	const [formData, setFormData] = useState(initialState);
	const [categories, setCategories] = useState([]); 
	const [usernames, setUsernames] = useState([]); 
	const [groupnames, setGroupnames] = useState([]); /
  
	useEffect(() => {
		if (open) {
		  fetchUsersGlpi();
		  fetchGroupsGlpi();
		}
	  }, [open]);

	const handleChange = (field, value) => {
		if (value instanceof FileList) {
		  value = Array.from(value);
		}
	  
		setFormData({ ...formData, [field]: value });
		console.log('field: ', field, 'value', value);
	  };

const handleSubmit = async (event) => {
	console.log('handleeeeeeeeeeee')
	event.preventDefault();
  
	try {
	  const { title, categoryId, userId, groupId, description, file } = formData;
  
	  const data = new FormData();
  
		console.log('asdasdasdasd')
		if (file && Array.isArray(file)) {
			for (let i = 0; i < file.length; i++) {
			  data.append('file', file[i]);
			}
		  }

	  console.log('handle2')

	  data.append('title', title);
	  data.append('categoryId', categoryId);
	  data.append('userId', userId);
	  data.append('groupId', groupId);
	  data.append('description', description);
  
	  const response = await axios.post('http://localhost:8080/createticketglpi', data);
  
	  console.log('Resposta do Backend:', response.data);
	  toast.success('Operação realizada com sucesso!')
	  handleDrawerClose();
  
	  setFormData(initialState);
	} catch (error) {
	}
  };
	const fetchUsersGlpi = async () => {
		try {
		  const response = await axios.get(`http://localhost:8080/getglpiusers`);
		  setUsernames(response.data.data);
		} catch (error) {
		  console.error('Erro ao obter usuarios:', error.message);
		}
	  };
  
	  const fetchGroupsGlpi = async () => {
		try {
		  const response = await axios.get(`http://localhost:8080/getglpigroups`);
		  setGroupnames(response.data.data);
		} catch (error) {
		  console.error('Erro ao obter usuarios:', error.message);
		}
	  };
  
	const fetchCategories = async (tipo) => {
	  try {
		const response = await axios.get(`http://localhost:8080/glpicategories?tipo=${tipo}`);
		setCategories(response.data.data);
		console.log('teste nessa porra');
		console.log(console.data.data);
	  } catch (error) {
		console.error('Erro ao obter categorias:', error.message);
	  }
	};

	return (
		<>
			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="right"
				open={open}
				PaperProps={{ style: { position: "absolute" } }}
				BackdropProps={{ style: { position: "absolute" } }}
				ModalProps={{
					container: document.getElementById("drawer-container"),
					style: { position: "absolute" },
				}}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className={classes.header}>
					<IconButton onClick={handleDrawerClose}>
						<CloseIcon />
					</IconButton>
					<Typography style={{ justifySelf: "center" }}>
						{'Abertura de Chamado'}
					</Typography>
				</div>
				{loading ? (
					<ContactDrawerSkeleton classes={classes} />
				) : (
					<div className={classes.content}>
					<label htmlFor="singleLineInput">Titulo:</label>
					<input
						type="text"
						id="titleInput"
						name="singleLineInput"
						value={formData.title} 
						onChange={(e) => handleChange('title', e.target.value)} 
						/>
					/>
					<InputLabel>Tipo:</InputLabel>
				 	<select onChange={(e) => fetchCategories(e.target.value)}>
					 <option value="0">-----Selecione-----</option>
					<option value="1">Incidente</option>
					<option value="2">Requisição</option>
					</select>
					<InputLabel>Categoria</InputLabel>
					<select onChange={(e) => handleChange('categoryId', e.target.value)} value={formData.categoryId}>
					<option value="0">-----Selecione-----</option>
					{categories.map((category) => (
						<option key={category.id} value={category.id}>
						{category.name}
						</option>
					))}
					</select>
					<InputLabel>Usuario solicitante</InputLabel>
					<select onChange={(e) => handleChange('userId', e.target.value)} value={formData.userId}>

					<option value="0">-----Selecione-----</option>
					{usernames.map((user) => (
						<option key={user.id} value={user.id}>
						{user.name}
						</option>
					))}
					</select>
					<InputLabel>Atribuido ao grupo técnico:</InputLabel>
					<select onChange={(e) => handleChange('groupId', e.target.value)} value={formData.groupId}>
					<option value="0">-----Selecione-----</option>
					{groupnames.map((group) => (
						<option key={group.id} value={group.id}>
						{group.name}
						</option>
					))}
					</select>
					<label htmlFor="multilineInput">Descrição:</label>
					<textarea
					value={formData.description} /
					onChange={(e) => handleChange('description', e.target.value)} // 
					id="multilineInput"
					name="multilineInput"
					rows={5}  
					cols={40} //
					/>
					<InputLabel>Arquivos:</InputLabel>
					<div 
  style={{ border: '1px solid #000', padding: '10px', width: '200px', height: '100px', overflow: 'auto' }}
  onDragOver={(event) => {
    event.preventDefault();
  }}
  onDrop={(event) => {
    event.preventDefault();
    handleChange('file', event.dataTransfer.files);
  }}
>
  <label>
    {(!formData.file || formData.file.length === 0) && 'Arraste e solte os arquivos aqui ou clique para selecionar:'}
    <input type="file" onChange={event => handleChange('file', event.target.files)} multiple style={{ display: 'none' }} />
  </label>
  {formData.file && Array.isArray(formData.file) && formData.file.map((file, index) => (
    <p key={index}>{file.name}</p>
  ))}
</div>
					<br />
					<button type="submit" onClick={handleSubmit}>Enviar</button>
				  </div>
				)}
			</Drawer>
		</>
	);
};

export default ContactDrawer;
