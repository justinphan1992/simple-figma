import Grid from '@mui/material/Grid';
import { TreeView } from './components/TreeView';
import { Canvas } from './components/Canvas';
import CanvasContextProvider from './context/CanvasContext';

function App() {
  return (
    <CanvasContextProvider>
      <Grid container spacing={2}>
        <Grid item xs={4} lg={3}>
          <TreeView />
        </Grid>
        <Grid item xs={8} lg={9}>
          <Canvas />
        </Grid>
      </Grid>
    </CanvasContextProvider>
  )
}

export default App
