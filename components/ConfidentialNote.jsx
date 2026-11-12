import { PxIcon } from "./Pixel";

// Shown on work done under a confidentiality agreement (Experience role and project case study)
const ConfidentialNote = () => (
  <p className="confidential">
    <PxIcon name="lock" />
    <span>Project details remain confidential as per agreement.</span>
  </p>
);

export default ConfidentialNote;
