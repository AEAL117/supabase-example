import { useState, useEffect } from 'react';
import Table from "../table";

const Reminder =({ reminders })=>{

  useEffect(() => {
   console.log(reminders);
  // reminders.forEach(element => console.log(element));

  }, [reminders])


  
  return (
    <div className="form-widget">
      <div>

        <Table>

        </Table>
      </div>
    
    </div>
  )
}
export default Reminder;