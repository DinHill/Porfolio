import { HiOutlineLockClosed } from "react-icons/hi";

// Shown on work done under a confidentiality agreement (Experience role and project case study)
const ConfidentialNote = () => (
  <p className="confidential">
    <HiOutlineLockClosed aria-hidden="true" />
    <span>Project details remain confidential as per agreement.</span>
  </p>
);

export default ConfidentialNote;
