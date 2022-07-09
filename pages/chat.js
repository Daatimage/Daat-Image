import React from 'react';
import { Component } from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { IoSend } from 'react-icons/io5';
import { BsImageFill } from "react-icons/bs";
import { createClient } from '@supabase/supabase-js'
import { ButtonSendSticker } from '../source/components/ButtonSendSticker';
import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { BiSend } from 'react-icons/bi';
import { RiDeleteBinLine } from 'react-icons/ri';
// import { ButtonSendFile } from '../source/components/ButtonSendFile';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZHBoY3dmenBlbmhhYnpoYmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTczNzA5ODksImV4cCI6MTk3Mjk0Njk4OX0.Y53_1oNFjvZJBAooQ4WLIAZPu53KxW3s7HTRtM7IA1w'

const SUPABASE_URL = 'https://xrdphcwfzpenhabzhbfo.supabase.co'

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem) {
  return supabaseClient
    .from('mensagens')
    .on('INSERT', (respostaLive) => {
      adicionaMensagem(respostaLive.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;
  const [mensagem, setMensagem] = React.useState('');
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

  React.useEffect(() => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', {ascending: false})
      .then(({ data }) => {
        setListaDeMensagens(data);
      });
      const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
        setListaDeMensagens((valorAtualDaLista) => {
          return [
            novaMensagem,
            ...valorAtualDaLista
          ]
        });
      });

      return () => {
        subscription.unsubscribe();
      }
  }, []);


  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: usuarioLogado,
      texto: novaMensagem
    };

  supabaseClient
    .from('mensagens')
    .insert([
      mensagem
    ])
    .then(({ data }) => {

    });

    setMensagem('');
  }

  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://wallpapercave.com/wp/wp2705378.jpg)`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[550],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />

        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[750],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >
          <MessageList mensagens={listaDeMensagens} />

          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[550],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals['000'],
              }}
            />

            <ButtonSendSticker
              onStickerClick={(sticker) => {
                // console.log('[USANDO O COMPONENTE] Salva esse sticker no banco', sticker);
                handleNovaMensagem(':sticker: ' + sticker);
              }}
            />

            <ButtonSendFile />


            <Button
              variant='tertiary'
              label={< BiSend size={23} />}
              type='submit'
              styleSheet={{
                position: 'absolute',
                marginBottom: '6px',
                right: '140PX',
                color: appConfig.theme.colors.neutrals[200],
              }}
              buttonColors={{
                mainColorLight: 'none',
              }}

              onClick={(event) => {
                event.preventDefault();
                if (mensagem.length > 0) {
                  handleNovaMensagem(mensagem);
                }
              }}
            />

          </Box>
        </Box>
      </Box>
    </Box>
  )

  function MessageList(props) {
    return (
      <Box
        tag="ul"
        styleSheet={{
          overflow: 'auto',
          wordBreak: 'break-word',
          display: 'flex',
          flexDirection: 'column-reverse',
          flex: 1,
          color: appConfig.theme.colors.neutrals["000"],
          marginBottom: '16px',
        }}
      >

        {props.mensagens.map((mensagem) => {
          return (
            <Text
              key={mensagem.id}
              tag="li"
              styleSheet={{
                borderRadius: '5px',
                padding: '6px',
                marginBottom: '12px',
                wordWrap: 'word-break',
                hover: {
                  // backgroundColor: appConfig.theme.colors.neutrals["900"],
                  //Esse é o hover
                },
              }}
            >

              <Box
                styleSheet={{
                  marginBottom: '8px',
                  width: '100%',
                  alignItems: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >

                <Box>
                  <Image
                    styleSheet={{
                      width: '25px',
                      height: '25px',
                      borderRadius: '50%',
                      display: 'inline-block',
                      marginRight: '8px',
                    }}
                    src={`https://github.com/${mensagem.de}.png`}
                  />

                  <Text tag="strong">
                    {mensagem.de}
                  </Text>

                  <Text
                    styleSheet={{
                      fontSize: '10px',
                      marginLeft: '8px',
                      color: appConfig.theme.colors.neutrals[300],
                    }}
                    tag="span"
                  >
                    {(new Date().toLocaleDateString())}
                  </Text>

                </Box>

                <Box
                  title={`Apagar mensagem`}
                  styleSheet={{
                    padding: '2px 15px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {

                    let resposta = confirm('Deseja remover essa mensagem?');
                    if (resposta === true) {
                      supabaseClient
                        .from('mensagens')
                        .delete()
                        .match({ id: mensagem.id }).then(() => {
                          let indice = listaDeMensagens.indexOf(mensagem);
                          listaDeMensagens.splice(indice, 1)
                          setListaDeMensagens([...listaDeMensagens])
                        })
                    }

                  }}
                >
                  {<RiDeleteBinLine />}
                </Box>
              </Box>

              {mensagem.texto.startsWith(':sticker:')
                ? (
                  <Image src={mensagem.texto.replace(':sticker:', '')} />
                )
                : mensagem.texto.startsWith(':image:')
                  ? (
                    <Image
                      styleSheet={{
                        maxWidth: {
                          xs: '150px',
                          md: '300px',
                        },
                      }}
                      src={mensagem.texto.replace(':image:', '')}
                    />
                  )
                  : (
                    mensagem.texto
                  )}
            </Text>
          );
        })}
      </Box>
    )
  }

}

function ButtonSendFile() {
  const [isOpen, setOpenState] = React.useState('');
  const [file, setFile] = React.useState(null);
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;

  async function fileUploadHandler() {
    debugger;
    console.log(file.name)
    if (file != null) {
      const { data, error } = await supabaseClient.storage.from('images').upload(`public/${file.name}`,
        file, {
        cacheControl: 3600,
        upsert: false
      });
      getUrl();
      // console.log(data);
      // const { signedURL, urlError } = await supabaseClient.storage.from('images').createSignedUrl(`public/${file.name}`);
      // const { link, erro } = supabaseClient.storage.from('images').getPublicUrl(`public/${file.name}`);
      // console.log(link);
      // handleNovaMensagem(`:image:${link}`);
    }
  }

  function getUrl() {
    debugger;
    const link = supabaseClient.storage.from('images').getPublicUrl(`public/${file.name}`);
    console.log(link);
    handleNovaMensagem(`:image:${link.publicURL}`);
  }

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: usuarioLogado,
      texto: novaMensagem
    };

    supabaseClient
      .from('mensagens')
      .insert([
        mensagem
      ])
      .then(({ data }) => {

      });
  }

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
        label={<BsImageFill />}
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
        >
          <Text
            styleSheet={{
              color: appConfig.theme.colors.neutrals["000"],
              fontWeight: 'bold',
            }}
          >
            Upload
          </Text>

          {/* <InputSendFile />  */}

          <Box
            styleSheet={{
              position: 'relative',
              margin: '2px',
            }}
          >
            <input id="inputFile" name="inputFile" type="file" onChange={(event) => {
              const selectedFile = event.target.files[0];
              setFile(selectedFile);
            }} />
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
              label={<IoSend />}
              onClick={fileUploadHandler}
            >
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )

}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}
