const loginFormStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    fontFamily: 'Inter, system-ui, sans-serif',
    color: '#757575',
    backgroundColor: '#242424',
  },
  formContainer: {
    width: '100%',
    maxWidth: '416px',
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 1px 4px rgba(60, 64, 67, 0.3)',
  },
  textField: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#dadce0',
      },
      '&:hover fieldset': {
        borderColor: '#3498db',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3498db',
      },
    },
    input: {
      width: '100%',
      color: '#757575',
      fontSize: '1.2rem',
    },
    label: {
      color: '#757575',
      fontSize: '1.2rem',
    },
  },
  checkBox: {
    color: '#3498db',
    '&.Mui-checked': {
      color: '#3498db',
    },
    transform: 'scale(1.3)',
  },
  submitButton: {
    mt: 4,
    mb: 3,
    backgroundColor: '#3498db',
    color: '#fff',
    textTransform: 'none',
    fontWeight: '600',
    fontSize: '1.2rem',
    padding: '12px 24px',
    '&:hover': {
      backgroundColor: '#2877c4',
    },
  },
  linkText: {
    color: '#3498db',
    fontSize: '1.2rem',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

export default loginFormStyles;
