import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert, CircularProgress, RadioGroup, FormControlLabel, Radio, FormLabel, Typography, IconButton, InputAdornment, Box } from '@mui/material';
import { forgotPassword, resetPassword } from '../api/forgotPassword';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Slide from '@mui/material/Slide';

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [response, setResponse] = useState<any>(null);
  const [showReset, setShowReset] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResponse(null);
    try {
      let res;
      if (method === 'email') {
        res = await forgotPassword({ email });
      } else {
        res = await forgotPassword({ phone });
      }
      // Espera 2 segundos antes de mostrar el resultado
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResponse(res);
      setSuccess(true);
    } catch (e: any) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setError(e?.message || 'No se pudo enviar la recuperación.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Simulación de petición al backend para cambiar contraseña
  const handleResetPassword = async () => {
    setResetLoading(true);
    setResetError(null);
    setResetSuccess(false);
    let resp;
    try {
      if (resetToken && newPassword) {
         resp = await resetPassword({ token: resetToken, newPassword: newPassword });
      }
      await new Promise(res => setTimeout(res, 1200));
      setResetSuccess(true);
    } catch (e: any) {
      setResetError(e?.message || 'No se pudo cambiar la contraseña.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Recuperar contraseña</DialogTitle>
      <DialogContent>
        <FormLabel component="legend" sx={{ mt: 1 }}>¿Cómo quieres recuperar tu contraseña?</FormLabel>
        <RadioGroup
          row
          value={method}
          onChange={e => setMethod(e.target.value as 'email' | 'phone')}
          sx={{ mb: 1 }}
        >
          <FormControlLabel value="email" control={<Radio />} label="Correo electrónico" />
          <FormControlLabel value="phone" control={<Radio />} label="Teléfono" />
        </RadioGroup>
        {method === 'email' ? (
          <TextField
            label="Email registrado"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
        ) : (
          <TextField
            label="Teléfono registrado"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            fullWidth
            margin="normal"
          />
        )}
        {success && response && !showReset && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              ¡Solicitud exitosa! Copia el siguiente token y haz click en <b>Cambiar contraseña</b> para finalizar el proceso.
            </Typography>
            <TextField
              value={response.token || ''}
              fullWidth
              margin="dense"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleCopy(response.token)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                readOnly: true,
              }}
              size="small"
            />
            <Typography variant="body2" sx={{ mt: 1 }}>Expira en: <b>{response.expiresIn || response.exp || 'N/A'}</b></Typography>
            {response.message && <Typography variant="body2" sx={{ mt: 1 }}>{response.message}</Typography>}
            <Box mt={2} textAlign="center">
              <Button variant="outlined" onClick={() => setShowReset(true)}>
                Cambiar contraseña
              </Button>
            </Box>
          </Alert>
        )}
        <Slide direction="up" in={showReset} mountOnEnter unmountOnExit>
          <Box mt={3}>
            <Typography variant="h6" mb={2} align="center">Cambiar contraseña</Typography>
            <TextField
              label="Token de recuperación"
              value={resetToken}
              onChange={e => setResetToken(e.target.value)}
              fullWidth
              margin="normal"
              autoFocus
            />
            <TextField
              label="Nueva contraseña"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            {resetError && <Alert severity="error">{resetError}</Alert>}
            {resetSuccess && <Alert severity="success">¡Contraseña cambiada exitosamente!</Alert>}
            <Box mt={2} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleResetPassword}
                disabled={resetLoading || !resetToken || !newPassword}
              >
                {resetLoading ? <CircularProgress size={20} /> : 'Confirmar cambio'}
              </Button>
              <Button
                variant="text"
                sx={{ ml: 2 }}
                onClick={() => setShowReset(false)}
                disabled={resetLoading}
              >
                Volver
              </Button>
            </Box>
          </Box>
        </Slide>
        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button onClick={handleSend} variant="contained" disabled={loading || (method === 'email' ? !email : !phone)}>
          {loading ? <CircularProgress size={20} /> : 'Enviar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
