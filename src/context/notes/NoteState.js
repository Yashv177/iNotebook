// import React, { useState } from "react";
import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000"
    const notesInitial = []
      const [notes, setNotes] = useState(notesInitial);

      //get all notes
      const getNotes = async () => {
        try {
          const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token')
            },
          });
            const json = await response.json();
           setNotes(json);
  
        } catch (error) {
          console.error('Error fetching notes:', error);
        }
      };

      // Add notes
      const addNote = async (title , description , tag)=>{
        console.log('adding a new note')
        // todo api call
        const response = await fetch(`${host}/api/notes/addnotes`,{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
            'auth-token' : localStorage.getItem('token'),
          },
          body: JSON.stringify({title,description,tag})
        });
        const note = await response.json(); 
      setNotes(notes.concat(note))
      }

      // Delete notes
       // todo api call
        const deleteNote = async(id)=>{
          const response = await fetch(`${host}/api/notes/deletenotes/${id}`,{
            method: 'DELETE',
            headers:{
              'Content-Type': 'application/json',
              'auth-token' : localStorage.getItem('token'),
            },

          });
          const newNote = notes.filter((note)=>{return note._id!==id});
          setNotes(newNote);
          const json = await response.json();
          console.log(json)
          
        }

      // Edit notes
      const editNote = async (id , title , description , tag)=>{
        // Api call
        const response = await fetch(`${host}/api/notes/updatenotes/${id}`,{
          method: 'PUT',
          headers:{
            'Content-Type': 'application/json',
            'auth-token' : localStorage.getItem('token'),
          },
          body: JSON.stringify({title, description, tag})
        });
        const json = await response.json();
        console.log(json)
        
        let newNotes = JSON.parse(JSON.stringify(notes))
        for( let index = 0; index < newNotes.length; index++){
          //logic to edit notes
          const element = newNotes[index];
          if(element._id===id){
            newNotes[index].title = title;
            newNotes[index].description = description;
            newNotes[index].tag = tag;
          }
          break;
        }
        setNotes(newNotes);
      }

  return (
      <NoteContext.Provider value={{notes,addNote,deleteNote,editNote,getNotes}}>
        {props.children}
      </NoteContext.Provider>
  );
};
export default NoteState;