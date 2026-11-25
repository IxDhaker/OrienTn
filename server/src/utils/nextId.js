export const nextId = async (Model) => {
  const last = await Model.findOne().sort({ id: -1 }).select('id').lean();
  return (last?.id || 0) + 1;
};