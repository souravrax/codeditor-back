const controller = async ({ id }, res, SharedCode) => {
  console.log(id, "Data Requested");
  if (!id || id.length !== 24) {
    res.status(404).json({
      success: false,
    });
  } else {
    try {
      const doc = await SharedCode.find({
        _id: id,
      });

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
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Error retrieving code from database.",
      });
    }
  }
};

module.exports = controller;
