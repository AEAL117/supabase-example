import { useState, useEffect } from 'react';
import Table from "../table";
import { supabase } from '../../config/supabaseClient';
export default function Reminder({ reminders,userid }) {
  const [data, setData] = useState([]);
  const [title,setTitle] = useState(null);
  const [content,setContent] = useState(null);
  const [reminderdate,setReminderdate]=useState(null);
  
  useEffect(() => {
   //console.log(reminders);
   setData(reminders);
  }, [reminders])

  async function updateReminder({ title, content, reminder }) {
    try {
      
      const user = userid

      const updates = {

        user: user,
        title,
        content,
        reminder,
        created_at: new Date(),
      }

      let { error } = await supabase.from('recordatorios').insert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      
    }
  }

  return (
    <div className="form-widget">
      <h1>HOME</h1>
      <p>{userid}</p>
      <div>
      {/*reminders.map((t) => <li key={t.id}>  Titulo:{t.title} Contenido:{t.content} Fecha de recordatorio:{t.reminder}</li>)*/}
        <Table rows={data}>
          
        </Table>
      </div>
      <div style={{ width: 150 }}>
          <button className="button primary block">New reminder</button>
      </div>

      <div>
        <label htmlFor="title">Tittle</label>
        <input id="title" type="text" onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <input id="content" type="text" onChange={(e) => setContent(e.target.value)} />
      </div>
      <div>
        <label htmlFor="reminderdate">Reminder at</label>
        <input id="reminderdate" type="datetime-local" onChange={(e) => setReminderdate(e.target.value)} />
      </div>
      <button
          className="button block primary"
          onClick={() => updateReminder({ title, content, reminderdate })}
        
        >
         Guardar
        </button>

    </div>
  )
}