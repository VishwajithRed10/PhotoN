import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import M from "materialize-css";
import Cookies from "js-cookie";
import Select from 'react-select'

const MovetoAlbumButton = ({photoid,currAlbId})=> {

  // console.log(`picId: ${photoid}`);
  // console.log(`albId: ${currAlbId}`); 
  const ecookie = Cookies.get('id');
  const [albumId,setAlbumId] = useState("")
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    M.AutoInit();
  }, []);

  useEffect(()=>{
    const fetchAlbums = () => {
      axios.get("http://localhost:5001/api/getAlbums/withoutimage",{
        params: {
          ownerUserId:ecookie,
          photoId: photoid
        }
      }).then((response) => {
          setAlbums(response.data);
        })
        .catch((error) => console.error("Error fetching albums:", error));
    };

    fetchAlbums();
  },[])


  const options = albums.map((album) => ({
    value: album._id,
    label: album.vaultName
  }));

  const handleMoveToAlbum = () => {
    console.log(`Clicked Add Button ${albumId}`);

    axios
      .put(`http://localhost:5001/api/album/moveimage`, { 
        albumId: albumId,
        currAlbId: currAlbId,
        photoId: photoid,
      })
      .then((res) => {
        console.log('Response:', res.data);
        alert('Photo moved to album successfully');
        // You can perform additional actions here if needed
        window.location.reload();
      })
      .catch((err) => {
        console.error('Error while moving photo to album:', err);
        alert('Error moving photo to album');
      });
  };

  const handleClickAlbum = (e) =>{
    setAlbumId(e.value)
    console.log(albumId)
  }

  return (

  <div>
   <button className="btn modal-trigger" data-target="modal3"><i className="fas fa-exchange-alt"></i>


</button>

    <div id="modal3" className="modal">
      <div className="modal-content">
        {/* <div className="App">
          <header className="App-header">
            <div style={{ width: 400 }}>
              <ReactSearchAutocomplete
                items={items}
                onSearch={handleOnSearch}
                onSelect={handleOnSelect}
                formatResult={formatResult}
              />
            </div>
          </header>
        </div> */}
        <Select 
        options={options} 
        onChange={handleClickAlbum}  
        />
      </div>
      <div className="modal-footer">
        <button onClick={handleMoveToAlbum}>Add</button>
      </div>
    </div>
  </div>
  )
}

export default MovetoAlbumButton