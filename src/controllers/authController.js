const supabase = require('../config/supabase');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const {data:userData, error:userError} = await supabase.from("users").insert({
      email,
      password_hash : password
    });

    if(userError) throw userError;

    res.status(201).json({ success:true, message: 'User registered successfully', user: data.user });
  } catch (error) {
    res.status(400).json({success:false, error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.status(200).json({success:true, message: 'Login successful', user: data.user, token: data.session.access_token });
  } catch (error) {
    res.status(400).json({ success:false,error: error.message });
  }
};
