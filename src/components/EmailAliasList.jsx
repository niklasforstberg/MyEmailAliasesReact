import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Collapse,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { KeyboardArrowRight, KeyboardArrowDown, ExpandLess, ExpandMore } from '@mui/icons-material';
import React from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function EmailAliasList() {
  const [aliases, setAliases] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedAliasId, setExpandedAliasId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const [copiedId, setCopiedId] = useState(null);

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

  const handleCopy = async (alias) => {
    try {
      await navigator.clipboard.writeText(alias);
      setCopiedId(alias);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
        variant="standard"
        placeholder="Search aliases..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ 
          mb: 3,
          '& .MuiInput-underline:before': {
            borderBottom: '2px solid rgba(0, 0, 0, 0.42)'
          }
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }
        }}
      />
      
      <Paper sx={{ 
        boxShadow: 'none',
        bgcolor: 'transparent'
      }}>
        {filteredAliases.length === 0 ? (
          <Typography sx={{ p: 2 }}>
            {searchQuery ? 'No matching aliases found' : 'No aliases found. Create your first alias!'}
          </Typography>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredAliases.map((alias) => (
              <Box key={alias.id}>
                <ListItem disablePadding sx={{ minHeight: 0 }}>
                  <ListItemButton 
                    disableRipple
                    sx={{ 
                      p: 0,
                      minHeight: 0,
                      '&:hover': {
                        background: 'none'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                      <Box
                        onClick={() => setExpandedAliasId(expandedAliasId === alias.id ? null : alias.id)}
                        sx={{ 
                          cursor: 'pointer',
                          py: 0.5,
                          px: 1,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {expandedAliasId === alias.id ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                      </Box>
                      <Typography sx={{ 
                        flex: 1, 
                        cursor: 'text',
                        userSelect: 'text'
                      }}>
                        {alias.alias}
                      </Typography>
                      <Tooltip title={copiedId === alias.alias ? "Copied!" : "Copy to clipboard"}>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(alias.alias);
                          }}
                          size="small"
                          sx={{
                            mr: 1,
                            color: copiedId === alias.alias ? 'success.main' : 'action.active',
                            opacity: 0,
                            '&:hover': {
                              opacity: 1
                            },
                            '.MuiListItem-root:hover &': {
                              opacity: 1
                            }
                          }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItemButton>
                </ListItem>
                <Collapse in={expandedAliasId === alias.id} timeout="auto">
                  <Box sx={{ p: 2, pl: 4 }}>
                    <Typography>
                      {alias.forwardingAddresses?.map((fa, index) => (
                        <React.Fragment key={fa.id}>
                          ⟶ {fa.forwardingAddress}
                          {index < alias.forwardingAddresses.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                      {' • '}
                      {alias.status === 'ACTIVE' ? 'active' : 'inactive'}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}

export default EmailAliasList; 