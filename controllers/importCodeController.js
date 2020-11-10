const controller = ({ id }, res, SharedCode) => {
    console.log(id, "Data Requested");
    if (!id || id.length !== 24) {
        res.status(404).json({
            success: false,
        });
    } else {
        SharedCode.find(
            {
                _id: id,
            },
            (err, doc) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({
                        success: false,
                    });
                }
                if (doc.length == 0) {
                    res.status(200).json({
                        success: false,
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        data: doc[0],
                    });
                }
            }
        );
    }
};

module.exports = controller;