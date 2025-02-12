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
  Alert,
  TextField
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';

function EmailAliasList() {
  const [aliases, setAliases] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedAliasId, setExpandedAliasId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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
        
        console.log('Raw response:', response);
        if (response.data) {
          console.log('Aliases data:', response.data);
          setAliases(response.data);
        }
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.token) {
      console.log('Starting alias fetch...');
      console.log('Auth token:', user.token);
      fetchAliases();
    }
  }, [user]);

  const filteredAliases = aliases.filter(alias =>
    alias.alias.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

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
    <Box className="aliases-container">
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search aliases..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />
      
      {filteredAliases.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>
            {searchQuery ? 'No matching aliases found' : 'No aliases found. Create your first alias!'}
          </Typography>
        </Paper>
      ) : (
        <List component={Paper} sx={{ 
          boxShadow: 'none',
          bgcolor: 'transparent'
        }}>
          {filteredAliases.map((alias) => (
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
                  <Typography>
                    Forward To: {alias.forwardingAddresses?.map(fa => fa.forwardingAddress).join(', ')}
                  </Typography>
                  <Typography>
                    Status: {alias.status === 'ACTIVE' ? 'Active' : 'Inactive'}
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