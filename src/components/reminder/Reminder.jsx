import { useState, useEffect } from 'react';
import Table from "../table";

export default function Reminder({ reminders }) {
  const [data, setData] = useState([])
  useEffect(() => {
   //console.log(reminders);
   setData(reminders);
  }, [reminders])

  return (
    <div className="form-widget">
      <div>
      {reminders.map((t) => <li key={t.id}>  Titulo:{t.title} Contenido:{t.content} Fecha de recordatorio:{t.reminder}</li>)}
        <Table rows={data}>
          
        </Table>
      </div>
    
    </div>
  )
}