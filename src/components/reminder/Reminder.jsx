import { useState, useEffect } from 'react';
import Table from "../table";
export default function Reminder({ reminders,userid }) {
  const [data, setData] = useState([]);
  useEffect(() => {
   //console.log(reminders);
   setData(reminders);
  }, [reminders])


  

  return (
    <div className="form-widget">
      <h1>HOME</h1>
      <p>{userid}</p>
      <div>
        <Table rows={data}>
          
        </Table>
      </div>
     



    </div>
  )
}