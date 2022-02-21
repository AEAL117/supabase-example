import i18next from '../../config/localization/i18n';
import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import Avatar from "../avatar";
import Navbar from "../navbar";
import Reminder from "../reminder";
//import Reminder from "../reminder";

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [navuser, setNavuser] = useState(null)
  const [reminders,setReminders]=useState(null);


  useEffect(() => {
    if (avatar_url) downloadImage(avatar_url)
    getProfile()
    getRecordatorios()
  }, [session, avatar_url])


  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setNavuser(url);

      console.log(url);
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
  //<p>{i18next.t("welcome")}</p>
  //<p>{i18next.t("name")}</p>
  //<p>{i18next.t("another")}</p>
  //<p>{username}</p>
  /*
        <div style={{ width: 150 }}>
          <button className="button primary block">Change Language</button>
        </div>*/

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
        
        console.log(data);
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">

      <Navbar usName={username} avatar={navuser} />
      
      <Avatar
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url)
          updateProfile({ username, website, avatar_url: url })
        }}
      />

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
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
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button className="button block" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
   {reminders===null ? "":<Reminder reminders={reminders}/>} 
    </div>
  )
}