import React, {
  useEffect,
  useState
} from 'react';
import {
  useAuth0
} from '../react-auth0-spa';
import axios from 'axios';
import Dropzone from './Dropzone';
import {
  Button
} from 'reactstrap';

const HomeContent = (props) => {
    const [isDoctor, setDoctor] = useState();
    const [isPatient, setPatient] = useState();
    const [files, setFiles] = useState();

    // console.log(props.theUser);

    useEffect(() => {
      // axios post to express server to check whether the user is a doctor or a patient
      const initialize = async () => {
        const axiosResponse = await axios({
          method: 'POST',
          url: 'http://localhost:5000/api/healthtrac/patients',
          data: {
            name: props.theUser.name,
            email: props.theUser.email,
            sub: props.theUser.sub
          }
        });

        const user = axiosResponse.data.user;
        if (user.is_patient) setPatient(true);
        if (user.is_doctor) setDoctor(true);

      }
      initialize();
      // eslint-disable-next-line
    }, []);

    const onChangeHandler = event => {
      console.log()
      setFiles(event.target.files[0])
    }
    // const onReceiveFiles = (filesFromDropzone) => {
    //   console.log('This is dropzone',filesFromDropzone[0]);
    //   //setFiles(filesFromDropzone[0]);
    //   setFiles(filesFromDropzone);
    // }

    const onReceiveFiles = (filesFromDropzone) => {
    console.log('This is dropzone',filesFromDropzone);
    setFiles(filesFromDropzone);
  }

  const uploadCsvFile = async () => {
   console.log(files); //Undefined how to define

    // create data to be sent to express
   // the type is form data, because we want to send file instead of json
   const formData = new FormData();
    formData.append('file', files);
    formData.append('email', props.theUser.email);
    formData.append('sub', props.theUser.sub);
    console.log('formData:',formData);

    const axiosResponse = await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/healthtrac/patients/upload',
     headers: {
        'Content-Type': 'multipart/form-data'
     },
     data: formData
    });

      console.log(axiosResponse.data);
     
    }




    if (!isDoctor && !isPatient) {
      return ( <div> Page is loading... </div>);
      }
      else if (isDoctor) {
        return ( <div>
          <div> Doctor name: {
            props.theUser.name
          } </div> <div> Doctor email: {
            props.theUser.email
          } </div> {
            /*<div>Doctor sub: {props.theUser.sub}</div>*/ } </div>
        );
      } else if (isPatient) {
        return ( <div>
          <div> Patient name: {
            props.theUser.name
          } </div> <div> Patient email: {
            props.theUser.email
          } </div> {
            /*<div>Patient sub: {props.theUser.sub}</div>*/ } {
            /*<Dropzone onReceiveFiles={onReceiveFiles} />*/ } <
          input type = 'file'
          name = 'file'
          onChange = {
            onChangeHandler
          }
          /> <Button type = "button"
          onClick = {
            uploadCsvFile
          } > Upload </Button> </div>
        );
      }
    }

    const Home = (props) => {
        const {
          loading,
          user
        } = useAuth0();
        if (loading || !user) {
          return ( <div> Welcome to HealthTrac </div>
          );
        }
        return ( < HomeContent {
            ...props
          }
          theUser = {
            user
          }/>)
        }


        export default Home;