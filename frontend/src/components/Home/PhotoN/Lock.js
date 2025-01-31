import { useEffect, useState } from "react";
import Grid from "../../Grid.js";
import axios from "axios";
import React from "react";
import Cookies from 'js-cookie';
import './css_to_photoN/lock.css'

const Lock = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [photos, setPhotos] = useState([]);
  const ecookie = Cookies.get('id');
  const [loading, setLoading] = useState(false); 
  useEffect(() => {
    if (authenticated) {
      axios
        .get("http://localhost:5001/api/get/lock",{
          params:{
            username: ecookie,
          }
        })
        .then((res) => {
          console.log(res.data);

          const processedPhotos = res.data.map((photo) => ({
            ...photo,
          }));

          setPhotos(processedPhotos);
          console.log(photos[0]);
        })
        .catch((err) => console.log(err));
    }
  }, [authenticated]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Here you can add your password validation logic
      // Here you can add your password validation logic
      setLoading(true) 
      const getData = async () => {
        try {
            await axios.get(`http://localhost:5001/api/auth/lock`, {
                params: {
                    username: ecookie,
                    password: password,
                }
            }).then(res => {
              console.log("Ok")
                console.log(res.data)
                const { valid } = res.data;

                if (valid) {
                    setAuthenticated(true);
                } else {
                    alert('Incorrect Credentials, Please Retry');
                }
            })

        } catch (error) {
            console.error('Validation error:', error);
        }
        setPassword("")
        console.log(authenticated)
        setLoading(false); // Set loading back to false after validation
    }

    getData();
    
    
    
    // if (password === "LOCK") {
    //   setAuthenticated(true);
    // } else {
    //   alert("Incorrect password!");
    // }
  };

  return (
    <div className="main-content center">
      {loading ? (
              <h3>Loading...</h3>
            ):!authenticated ? (
        <div className="container2">
        <div className="search-container2">
    <div className="input-field">
      <input
        id="passwordInput"
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
  <button onClick={handleFormSubmit}>Submit</button>
  </div>
</div>
        </div>
      ) : photos.length > 0 ? (
        <Grid photos={photos} flag={2} />
      ): (
        <h3>No Photos</h3>
      )}
    </div>
  );
};

export default Lock;
