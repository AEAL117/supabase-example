import i18next from '../../config/localization/i18n';
import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import Avatar from "../avatar";
import Navbar from "../navbar";
import Reminder from "../reminder";

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [navuser, setNavuser] = useState(null)
  const [reminders, setReminders] = useState(null);
  const [userid] = useState(supabase.auth.user());
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [reminderdate, setReminderdate] = useState(new Date());
  const [issubmited, serIssubmited] = useState(false);
  const [reminderid, setReminderid] = useState(null);
  useEffect(() => {
    if (avatar_url) downloadImage(avatar_url)
    getProfile()
    getRecordatorios()
    //console.log(issubmited);
  }, [session, avatar_url, issubmited])


  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setNavuser(url);

      //console.log(url);
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }
  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteReminderById() {
    try {
      const { error } = await supabase
        .from('recordatorios')
        .delete()
        .eq('id', reminderid)
      if (error) {
        throw error
      } else {
        serIssubmited(true);
      }
    } catch (error) {
      alert(error.message)
    } finally {
      serIssubmited(false);
    }
  }


  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function insertReminder({ title, content, reminder }) {
    if (reminderid !== null && reminderid !== "") {
      updateReminder();
      //console.log(reminderid);
    } else {
      try {
        console.log(reminderid);
        console.log(userid.id);
        //const user = supabase.auth.user()

        const updates = {

          user: userid.id,
          title,
          content,
          reminder: reminderdate,
          created_at: new Date(),
        }
        console.log(updates);
        let { error } = await supabase.from('recordatorios').insert(updates, {
          returning: 'minimal', // Don't return the value after inserting
        })

        if (error) {
          throw error
        } else {
          serIssubmited(true);
        }
      } catch (error) {
        alert(error.message)
      } finally {
        serIssubmited(false);
      }
    }

  }

  async function updateReminder() {
    try {

      const user = userid

      const updates = {
        id: reminderid,
        user: user.id,
        title: title,
        content: content,
        reminder: reminderdate,
        created_at: new Date(),
      }

      let { error } = await supabase.from('recordatorios').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      } else {
        serIssubmited(true);
      }
    } catch (error) {
      alert(error.message)
    } finally {
      serIssubmited(false);
    }
  }
  //<p>{i18next.t("welcome")}</p>
  //<p>{i18next.t("name")}</p>
  //<p>{i18next.t("another")}</p>
  //<p>{username}</p>



  async function getRecordatorios() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('recordatorios')
        .select(`title, content, reminder, id`)
        .eq('user', user.id)


      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setReminders(data);

        // console.log(data);
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function getReminder() {
    try {

      let { data, error, status } = await supabase
        .from('recordatorios')
        .select(`title, content, reminder`)
        .eq('id', reminderid)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setReminderdate(data.reminder);
      }
    } catch (error) {
      alert(error.message)
    } finally {

    }
  }

  function changeLenguage(){
    let actual=localStorage.getItem('i18nextLng')
    localStorage.setItem('i18nextLng', actual==="es" ? "en":"es");
    window.location.reload(false);
  }

  return (
    <div className="form-widget">
     

      <Navbar usName={username} avatar={navuser} />

      <div style={{ width: 150 }}>
        <button className="button primary block"  onClick={() => changeLenguage()} >{i18next.t("lan")}</button>
      </div>
      <a href='https://github.com/AEAL117/supabase-example'>REPO LINK</a>
      <h1>{i18next.t("title1")}</h1>

      
      <Avatar
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url)
          updateProfile({ username, website, avatar_url: url })
        }}
      />

    
      <div>
        <label htmlFor="email">{i18next.t("field1")}</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">{i18next.t("field2")}</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">{i18next.t("field3")}</label>
        <input
          id="website"
          type="website"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button block primary"
          onClick={() => updateProfile({ username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : i18next.t("button2")}
        </button>
      </div>

      <div>
        <button className="button block" onClick={() => supabase.auth.signOut()}>
          {i18next.t("button3")}
        </button>
      </div>
      {reminders === null ? "" : <Reminder reminders={reminders} userid={userid.id} />}
      <div style={{ width: 150 }}>
        <button className="button primary block" onClick={() => getReminder()}>{i18next.t("button4")}</button>
        <input id="content" type="text" onChange={(e) => setReminderid(e.target.value)} />
      </div>
      <div>
        <label htmlFor="title">{i18next.t("field4")}</label>
        <input id="title" type="text" value={title || ''} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="content">{i18next.t("field5")}</label>
        <input id="content" type="text" value={content || ''} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div>
        <label htmlFor="reminderdate">{i18next.t("field6")}</label>
        <input id="reminderdate" type="date" value={reminderdate} onChange={(e) => setReminderdate(e.target.value)} />
      </div>
      <button
        className="button block primary"
        onClick={() => insertReminder({ title, content, reminderdate })}
      >
        {reminderid !== null && reminderid !== "" ? i18next.t("button5v2") : i18next.t("button5")}
      </button>
      {reminderid !== null && reminderid !== "" ? <button
        className="button block primary"
        onClick={() => deleteReminderById()}
      >
        {i18next.t("button6")}
      </button> : ""}
    </div>
  )
}