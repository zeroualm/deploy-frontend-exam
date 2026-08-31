import React, { Children,useState, useEffect } from "react";
import axios from "axios";
import Categories from "./Categories/Categories";
import * as Sentry from '@sentry/react';

function ToDoList() {

    const djangoApiUrlTask = `${import.meta.env.VITE_API_URL}/api/task/`
    const djangoApiUrlCat = `${import.meta.env.VITE_API_URL}/api/category/`

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorAddCat, setErrorAddCat] = useState(null);
    const [errorAddTask, setErrorAddTask] = useState(null);

    const [taches, setTaches] = useState([]);
    const [newTask,setNewTask] = useState("")

    const [categories, setCategories] = useState([]);
    const [newCategorie, setNewCategorie] = useState("")
    
    const [selectedFiltreCategorie, setSelectedFiltreCategorie] = useState("toutes");
    const [selectedTacheCategorie, setSelectedTacheCategorie] = useState("");

    const formatError = (err) => {
        if (err.response?.data) {
            return Object.values(err.response.data)
                .flat()
                .join(" ");
        }
        return "Erreur serveur.";
    };

    useEffect(() => {

        const getCategories = async () => {
            try {
                console.log("Récupération de la liste des catégories ...")
                const response = await axios.get(djangoApiUrlCat);
                console.log("Récupération de la liste des catégories terminée")
                console.log(response.data)
                setCategories(response.data)
                setError(null)
            } catch (err){
                if (err.response && err.response.status === 404) {
                    console.log("Erreur 404 : Aucune catégorie");
                } else {
                    console.log("--- ERROR FETCHING DATA ---");
                    console.log(err);
                    setError(err);
                    setCategories([]);
                }
                
            } finally {
                setIsLoading(false);
            }
        };

        getCategories();
    },[]);

    // Fonction ajout de catégories
    const addCategorie = async () => {
        try {
            console.log("Ajout de la catégorie ...")
            const response = await axios.post(djangoApiUrlCat,
                {
                    name: newCategorie,
                }
            );
            console.log("Catégorie ajoutée")
            console.log(response.data)

            const tempNewCat = {
                id : response.data["id"],
                name : newCategorie,
            } 

            setCategories(prev => [...prev, tempNewCat])
            setNewCategorie("")
            setErrorAddCat(null)
        } catch (err){
            console.error("--- ERROR SENDING DATA ---");
            console.error(err);
            setErrorAddCat(formatError(err));
        }
    }

    useEffect(() => {

        const getTasks = async () => {
            try {
                console.log("Récupération de la liste des tâches ...")
                const response = await axios.get(djangoApiUrlTask);
                console.log("Récupération de la liste des tâches terminée")
                console.log(response.data)
                setTaches(response.data)
                setError(null)
            } catch (err){
                if (err.response && err.response.status === 404) {
                    console.log("Erreur 404 : Aucune catégorie");
                }
                else {
                    console.error("--- ERROR FETCHING DATA ---");
                    console.error(err);
                    setError(err);
                    setTaches([]);
                }
                
            } finally {
                setIsLoading(false);
            }
        };

        getTasks();
    },[]);

    // Fonction ajout de tâches
    const addTache = async () => {
        try {
            console.log("Ajout de la tâche ...")
            const response = await axios.post(djangoApiUrlTask,
                {
                    description: newTask,
                    category: selectedTacheCategorie
                }
            );
            const tempNewTask = {
                id : response.data["id"],
                description : newTask,
                is_completed:response.data["is_completed"],
                category:response.data["category"],
                category_name:response.data["category_name"]
            } 
            setTaches(prev => [...prev, tempNewTask])
            setNewTask("")
            setErrorAddTask(null)
            console.log("Tâche ajoutée")
            console.log(response.data)
        } catch (err){
            console.error("--- ERROR SENDING DATA ---");
            console.error(err);
            setErrorAddTask(formatError(err));
        } 
    }

    // Fonction suppression de tâches
    const removeTache = async (idToRemove) => {
        try {
            console.log("Suppresion de la tâche ...")
            const response = await axios.delete(`${djangoApiUrlTask}${idToRemove}/`);
            setTaches(prev => prev.filter(taches => taches.id !== idToRemove));
            console.log("Tâche supprimée")
            console.log(response.data)
        } catch (err){
            console.error("--- ERROR DELETING DATA ---");
            console.error(err);
        }    
    };

    // Fonction complétion de tâches
    const completeTache = async (idToComplete, isCompleted) => {
        try {
            console.log("Modification de la tâche ...")
            const response = await axios.patch(`${djangoApiUrlTask}${idToComplete}/`,
                {
                    is_completed : !isCompleted
                }
            );
            setTaches(prev =>
                prev.map(taches =>
                    taches.id === idToComplete ? { ...taches, is_completed: !taches.is_completed } : taches
                )
            );
            console.log("Tâche modifiée")
            console.log(response.data)
        } catch (err){
            console.log("--- ERROR DELETING DATA ---");
            console.log(err);
        }    
        
    }
    
    function TestComponent() {
        const handleCrash = () => {
        // Cette fonction va planter car 'undefined' n'a pas de propriété 'name'
        const user = undefined;
        console.log(user.name);
      };

      return <button onClick={handleCrash}>Crash Test</button>;
    };

    return <section>
        <h1>Ma To-Do List par Catégories</h1>

        <div className="add-categorie">
            <input type="text" placeholder="Nouvelle catégorie" value={newCategorie}  onChange={(e) => setNewCategorie(e.target.value)} />
            <button onClick={addCategorie}>Ajouter catégorie</button>
            {errorAddCat && <p className="error">{errorAddCat}</p>}
        </div>

        <div className="filter-categorie">

            <Categories categories={categories} name="categorie" id="categorie" value={selectedFiltreCategorie} onChange={(e) => setSelectedFiltreCategorie(e.target.value)}>
                <option key="toutes" value="toutes">Toutes les catégories</option>
            </Categories>

        </div>

        <div className="add-tache">
            <input type="text" placeholder="Nouvelle tâche" value={newTask} onChange={(e) => setNewTask(e.target.value)} />

            <Categories categories={categories} name="categorie" id="categorie" value={selectedTacheCategorie} onChange={(e) => setSelectedTacheCategorie(e.target.value)}>
                <option>Choisir une catégorie</option>
            </Categories>

            <button onClick={addTache}>Ajouter</button>

            {errorAddTask && <p className="error">{errorAddTask}</p>}

        </div>

        <div className="display-tache">
            {isLoading && <p>Chargement</p>}

            {!isLoading && error && <p>{error.message}</p>}

            {!isLoading && !error && taches && (
                <>
                    {taches.filter(tache => selectedFiltreCategorie === "toutes" || String(tache.category) === String(selectedFiltreCategorie)).map((tache) => (
                    <div key={tache.id}>
                        <input type="checkbox" checked={tache.is_completed} onChange={() => completeTache(tache.id,tache.is_completed)}/>
                        <p className={tache.is_completed ? "crossed" : ""}>{tache.description} ({tache.category_name})</p>
                        <button onClick={() => removeTache(tache.id)}>Supprimer</button>
                    </div>
                    ))}
                    {taches.length === 0 ? (<p className="warning-task">Aucune tâche à afficher.</p>) : "" }
                </>
            )}
        </div>

    <TestComponent />
        
    </section>
}

export default ToDoList;