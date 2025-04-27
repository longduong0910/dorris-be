import User from '../../models/User.js';

const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        const { full_name, email, phone_number, address } = user;
        res.json({ full_name, email, phone_number, address });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

export default getUserInfo;