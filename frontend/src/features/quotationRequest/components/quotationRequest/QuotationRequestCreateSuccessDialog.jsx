import { Dialog, DialogContent, DialogActions, Button, Box, Container } from "@mui/material";
import { Card, Chip, Grid, Typography } from "@mui/material";
import { fDateTime } from "../../../../shared/utils/formatTime";
import { Scrollbar } from '../../../../shared/components/scrollbar';
import HeadingArea from "../../../../shared/components/heading-area/HeadingArea";
import GradingIcon from '@mui/icons-material/Grading';
import { StyledBox } from "../../../../shared/components/style-box";

export default function QuotationRequestCreateSuccessDialog({ state  , onClose }) {
  
  console.log(state)

  const { data } = state || {};

  return (
    <Container>
      <Dialog open={true} maxWidth="md" fullWidth>
        <DialogContent dividers>
          <div className="pt-2 pb-4">
            <Card className="p-3">
              <Scrollbar autoHide={false}>
                <StyledBox>
 
                </StyledBox>

              </Scrollbar>
            </Card>
          </div>
          <DialogActions>
            <Box sx={{ gap: 1, display: 'flex' }}>
              <Button variant="outlined" color='primary' size="small" onClick={onClose}>Aceptar</Button>
              <Button variant="outlined" color='primary' size="small" onClick={onClose}>Cerrar</Button>
            </Box>
          </DialogActions>
        </DialogContent>


      </Dialog>

    </Container>
  );
}
