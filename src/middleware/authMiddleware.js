const supabase = require('../config/supabase');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) throw error;

    req.user = user;

    const {data:userId , error:userError}= await supabase.from("users").select("id").eq('email' , user.email);

    if(userError) throw error;
    
    req.user.userId = userId[0].id;
    next();
  } catch (error) {
    res.status(401).json({ success:false , error});
  }
};

module.exports = authMiddleware;