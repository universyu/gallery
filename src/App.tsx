import ThreeDeeBackground from './components/ThreeDeeBackground'
import { styled } from '@mui/material'
import { IMG_LIST } from './constants'

const ItemWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing: 'border-box',
  borderRadius: '12px',
  flexDirection: 'column',
  background: 'rgba(20, 12, 40, 0.7)',
  boxShadow: '0 4px 20px rgba(128, 0, 255, 0.2)',
  width: '100%',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.03)' 
  }
})

const Image = styled('img')({
  width: '100%',
  height: 'auto',
  aspectRatio: '1/1',
  display: 'block',
  boxSizing: 'border-box',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
  objectFit: 'cover',
  userSelect:'none'

})

const TextWrapper = styled('p')({
  margin: 0,
  width: '100%',
  boxSizing: 'border-box',
  textAlign: 'center',
  color: '#f0c3ff',
  fontSize: '24px',
  padding: '16px',
  fontWeight: '500',
  userSelect:'none'
})
const Gallery = styled('div') ({
  padding: '48px 32px',
  display: 'grid',
  boxSizing: 'border-box',
  gap: '32px',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  width: '100%'
})

function App() {

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'auto'
      }}
    >
      <ThreeDeeBackground />
      <Gallery >
        {IMG_LIST.map((item) => {
          return (
            <ItemWrapper key={item.url}>
              <Image src={item.url} />
              <TextWrapper>{item.name}</TextWrapper>
            </ItemWrapper>
          )
        })}
      </Gallery>
    </div>
  )
}

export default App