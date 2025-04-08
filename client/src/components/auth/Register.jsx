import React, { useState, useContext, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper,
  Link,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Person, 
  HowToReg 
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    acceptTerms: false
  });
  
  const { name, email, password, password2, acceptTerms } = formData;
  const { register, isAuthenticated, error, loading, clearErrors } = useContext(AuthContext);
  const [localError, setLocalError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  // Definizione degli step di registrazione
  const steps = ['Informazioni personali', 'Credenziali di accesso'];

  useEffect(() => {
    // Redirect se già autenticato
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Pulisci errori precedenti quando il componente viene montato
    clearErrors();
    setLocalError(null);
    // eslint-disable-next-line
  }, [isAuthenticated, navigate]);

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    
    // Reset errore locale quando l'utente inizia a digitare
    setLocalError(null);
  };

  const toggleShowPassword = field => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowPassword2(!showPassword2);
    }
  };

  // Gestisce il passaggio al prossimo step
  const handleNext = () => {
    // Validazioni per il primo step
    if (activeStep === 0) {
      if (!name.trim()) {
        setLocalError('Il nome è obbligatorio');
        return;
      }
      
      if (!email.trim()) {
        setLocalError('L\'email è obbligatoria');
        return;
      }
      
      // Validazione email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        setLocalError('Inserisci un indirizzo email valido');
        return;
      }
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Gestisce il ritorno allo step precedente
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Gestisce il submit del form
  const onSubmit = e => {
    e.preventDefault();
    
    // Validazione finale
    if (password !== password2) {
      setLocalError('Le password non coincidono');
      return;
    }
    
    if (password.length < 6) {
      setLocalError('La password deve essere di almeno 6 caratteri');
      return;
    }
    
    if (!acceptTerms) {
      setLocalError('Devi accettare i termini e le condizioni');
      return;
    }
    
    // Procedi con la registrazione
    register({
      name,
      email,
      password
    });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            padding: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%',
            borderRadius: 2
          }}
        >
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'primary.main', 
              color: 'white', 
              borderRadius: '50%', 
              mb: 2 
            }}
          >
            <HowToReg />
          </Box>
          
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Registrati
          </Typography>
          
          {/* Stepper per la registrazione */}
          <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* Messaggio di errore */}
          {(error || localError) && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {localError || error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
            {activeStep === 0 ? (
              // Step 1: Informazioni personali
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Nome completo"
                  name="name"
                  autoFocus
                  value={name}
                  onChange={onChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Indirizzo Email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={onChange}
                  disabled={loading}
                />
              </>
            ) : (
              // Step 2: Credenziali di accesso
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={onChange}
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => toggleShowPassword('password')}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password2"
                  label="Conferma Password"
                  type={showPassword2 ? 'text' : 'password'}
                  id="password2"
                  value={password2}
                  onChange={onChange}
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => toggleShowPassword('password2')}
                          edge="end"
                        >
                          {showPassword2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="acceptTerms"
                      checked={acceptTerms}
                      onChange={onChange}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Accetto i{' '}
                      <Link component={RouterLink} to="#">
                        Termini e condizioni
                      </Link>{' '}
                      e la{' '}
                      <Link component={RouterLink} to="#">
                        Politica sulla privacy
                      </Link>
                    </Typography>
                  }
                  sx={{ mt: 2 }}
                />
              </>
            )}
            
            {/* Pulsanti di navigazione */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 2 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
              >
                Indietro
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Registrati'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Avanti
                </Button>
              )}
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component={RouterLink} to="/login" variant="body2">
                {"Hai già un account? Accedi"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;