import React, {useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import {
  Card, CardBody, Row, Col
} from 'reactstrap';

function Dropzone(props) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: '.csv'
  });
  
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  

  useEffect(()=>{
    const handleChange = (e) => {
      console.log(files);
      props.onReceiveFiles(files);
    };
    if(files && files.length > 0){
      handleChange();
    }
    // eslint-disable-next-line
  },[acceptedFiles]);

  function Dropzone() {
    const onDrop = React.useCallback(acceptedFiles => {
      console.log(acceptedFiles);
      //callback to parent here
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: ".csv, .txt"
    });
  
    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    );
  }
  

  // return (
  //   <Row>
  //     <Col className="mt-5 mb-5" sm={{ size: 10, offset: 1 }}>
  //       <Card>
  //         <CardBody>
  //           <section className="container">
  //             <div {...getRootProps({className: 'dropzone'})}>
  //               <input {...getInputProps()}/>
  //               <p>Drag 'n' drop some files here, or click to select files</p>
  //             </div>
  //             <aside>
  //               <h4>Files</h4>
  //               <ul>{files}</ul>
  //             </aside>
  //           </section>
  //         </CardBody>
  //       </Card>
  //     </Col>
  //   </Row>
  // );
}

export default Dropzone;