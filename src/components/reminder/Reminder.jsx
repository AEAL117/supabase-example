import { useState, useEffect } from 'react';
import Table from "../table";
import i18next from '../../config/localization/i18n';
export default function Reminder({ reminders,userid }) {
  const [data, setData] = useState([]);
  useEffect(() => {
   //console.log(reminders);
   setData(reminders);
  }, [reminders])


  

  return (
    <div className="form-widget">
      <h1> {i18next.t("title2")}</h1>
      <p>{i18next.t("paragraph1")}</p>
      <p>{userid}</p>
      <div>
        <Table rows={data}>
          
        </Table>
      </div>
     



    </div>
  )
}