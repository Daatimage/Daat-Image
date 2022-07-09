import React from 'react';
import { Component } from 'react';
import appConfig from '../../config.json';
import { BsImageFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { Box, Button, Text, Image } from '@skynexui/components';

export function ButtonSendFile(props) {
  const[isOpen, setOpenState] = React.useState('');

  return (
    <Box
      styleSheet={{
        position: 'relative',
        margin: '2px',
      }}
    >
      <Button
        styleSheet={{
          borderRadius: '50%',
          padding: '0 3px 0 0',
          minWidth: '50px',
          minHeight: '50px',
          fontSize: '20px',
          marginBottom: '8px',
          lineHeight: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: appConfig.theme.colors.neutrals[550],
          filter: 'grayscale(1)',
          hover: {
            filter: 'grayscale(1)',
          }
        }}
        label = {<BsImageFill/>}
        onClick={() => setOpenState(!isOpen)}
        />
          {isOpen && (
            <Box
              styleSheet={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '5px',
                position: 'absolute',
                backgroundColor: appConfig.theme.colors.neutrals[750],
                width: {
                  xs: '200px',
                  sm: '290px',
                },
                height: '150px',
                right: '30px',
                bottom: '50px',
                padding: '16px',
                boxShadow: 'rgba(4, 4, 5, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.24) 0px 8px 16px 0px',
              }}
              // onClick={() => setOpenState(false)}
            >
              <Text
                styleSheet={{
                  color: appConfig.theme.colors.neutrals["000"],
                  fontWeight: 'bold',
                }}
              >
                Upload
              </Text>

              <InputSendFile /> 
            </Box>
          )}
    </Box>
  )

}

class InputSendFile extends Component {

  state = {
    selectedFile: null
  }

  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
    console.log(this.state.selectedFile);
  }

  fileUploadHandler = () => {
    console.log(this.state.selectedFile);
  }

  render() {
    return(
      <Box
        styleSheet={{
          position: 'relative',
          margin: '2px',
        }}
      >
        <input type="file" onChange={this.fileSelectedHandler} />
        <Button
          styleSheet={{
            borderRadius: '50%',
            padding: '0 3px 0 0',
            minWidth: '50px',
            minHeight: '50px',
            fontSize: '20px',
            marginBottom: '8px',
            lineHeight: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            left: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[550],
            filter: 'grayscale(1)',
            hover: {
              filter: 'grayscale(1)',
            }
          }}
          label = {<IoSend/>}
          onClick = {this.fileUploadHandler}
        >
        </Button>
      </Box>
    )
  }

}
