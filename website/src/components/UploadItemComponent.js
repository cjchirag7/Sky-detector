import React, { Component } from 'react';
import ImageUploader from 'react-images-upload';
import { Button, Label, Col, Row, Input } from 'reactstrap';
import LineChart from 'react-linechart';
import '../../node_modules/react-linechart/dist/styles.css';

const required = val => val && val.length;
const requiredNum = val => !!val;
const minLength = len => val => val && val.length >= len;
const maxVal = len => val => !val || val <= len;
const minVal = len => val => val && val >= len;
const isNumber = val => !isNaN(Number(val));
const multiple = num => val => !val || val % num === 0;

/*let fileAdder=(e)=>{
    this.setState({imageFiles: this.state.imageFiles.concat(e.target.files)})
};*/

export const baseUrl = 'http://6ff1e5d3.ngrok.io/';

export const imageUrl = baseUrl + 'public/';

class UploadItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bid: false,
      images: null,
      imageFiles: [],
      submitted: false,
      angles: []
    };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(image) {
    console.log(image);
    this.setState({
      images: image
    });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    console.log(this.state.angles);
    const data = [
      {
        color: 'steelblue',
        points: this.state.angles.map((angle, i) => ({
          x: i + 1,
          y: angle
        }))
      }
    ];
    return (
      <div className='container  '>
        <div className='row justify-content-center heading'>
          <div className='col-12'>
            <h3 align='center'> Upload an image</h3>
          </div>
        </div>
        <Row className='row row-content justify-content-center'>
          <ImageUploader
            withIcon={true}
            label='Recommended height : 256px, .jpg,.png,.jpeg allowed'
            buttonText='Choose images'
            withLabel={true}
            onChange={this.onDrop}
            labelClass='text-secondary'
            imgExtension={['.jpg', '.gif', '.png', '.jpeg']}
            maxFileSize={5242880}
            withPreview
            className='uploader'
            name='images'
            singleImage
          />
        </Row>
        {/* <Row className='form-group'>
          <Label htmlFor='description' md={2}>
            Add
          </Label>
          <Col md={10}>
            <Input
              model='.description'
              id='description'
              name='description'
              placeholder='Some description of the product'
              className='form-control'
            />
          </Col>
        </Row> */}
        <Row className='align-self-center'>
          <Col className='text-center'>
            <Button
              className='bg-primary'
              onClick={() => {
                let formData = new FormData();
                // Assume "photo" is the name of the form field the server expects
                formData.append('image', this.state.images[0]);
                formData.append('username', 'cjchirag7');
                formData.append('addr1', 'IIT (ISM) Campus');
                formData.append('addr2', 'Dhanbad, Jharkhand');
                return fetch(`${baseUrl}get_mask`, {
                  method: 'POST',
                  body: formData,
                  header: {
                    'content-type': 'multipart/form-data'
                  },
                  credentials: 'same-origin'
                })
                  .then(
                    response => {
                      if (response.ok) {
                        return response;
                      }

                      const error = new Error(
                        `Error ${response.status}: ${response.statusText}`
                      );
                      error.response = response;
                      throw error;
                    },
                    error => {
                      const errmess = new Error(error.message);
                      throw errmess;
                    }
                  )
                  .then(response => response.json())
                  .then(response => {
                    const { mask, angles, percent, image, error } = response;
                    if (error) {
                      alert('Image not uploaded properly.');
                      console.log(error);
                      return;
                    }
                    this.setState({
                      mask: mask,
                      angles: JSON.parse(angles),
                      percent: percent,
                      submitted: true
                    });
                  })
                  .catch(error => {
                    console.log(error.message);
                    alert(error.message);
                  });
              }}
            >
              Submit
            </Button>
          </Col>
        </Row>
        <br />
        <br />
        {this.state.submitted ? (
          <Row className='row justify-content-center'>
            <img src={imageUrl + this.state.mask} />
            <br />
            <br />
            <LineChart width={600} height={400} data={data} />
          </Row>
        ) : (
          ''
        )}
        <br />
        <br />
        <br /> <br />
        <br />
        <br />
        <br /> <br />
        <br />
      </div>
    );
  }
}

export default UploadItem;
