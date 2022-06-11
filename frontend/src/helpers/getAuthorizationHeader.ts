export const getAuthorizationHeader = () => {

  const auth = localStorage.getItem('auth');

  const authObj = JSON.parse(<string>auth);
  
  if (!authObj.accessToken) return {};

  return {
    headers : {
      'Authorization': `Bearer ${authObj.accessToken}` 
    }
  }
}