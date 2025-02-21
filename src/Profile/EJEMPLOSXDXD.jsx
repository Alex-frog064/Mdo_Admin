import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

export default function Blogs() {
    const [formData, setFormData] = useState({
        titulo: '',
        imagen:'',
        categoria: '',
        id_veterinario:'',
        contenido: '',
    })
    const [titulo, settitulo] = useState("");
    const [categoria, setcategoria] = useNavigate("");
    const [id_veterinario, setid_veterinario] = useState ("");
    const [contenido, setcontenido] = useState("");
    const [imagen, setimagen] = useState ("");
}