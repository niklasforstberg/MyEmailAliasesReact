import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';

function EmailAliasList() {
  const [aliases, setAliases] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedAliasId, setExpandedAliasId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAliases = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5267/api/aliases', {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data) {
          setAliases(response.data);
        }
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.token) {
      fetchAliases();
    }
  }, [user]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 3, p: 2 }}>
        <Alert severity="error">
          <Typography variant="h6">Error loading aliases</Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 3, p: 2 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Your Email Aliases
      </Typography>
      
      {aliases.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No aliases found. Create your first alias!</Typography>
        </Paper>
      ) : (
        <List component={Paper} sx={{ 
          boxShadow: 'none',
          bgcolor: 'transparent'
        }}>
          {aliases.map((alias) => (
            <Box key={alias.id}>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => setExpandedAliasId(
                    expandedAliasId === alias.id ? null : alias.id
                  )}
                >
                  <ListItemText primary={alias.alias} />
                  {expandedAliasId === alias.id ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={expandedAliasId === alias.id} timeout="auto">
                <Box sx={{ p: 2, pl: 4 }}>
                  <Typography>Forward To: {alias.forwardTo}</Typography>
                  <Typography>
                    Status: {alias.isEnabled ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>
              </Collapse>
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
}

export default EmailAliasList; 