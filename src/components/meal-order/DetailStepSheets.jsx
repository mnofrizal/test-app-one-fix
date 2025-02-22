import React from "react";
import SubBidangSelector from "../SubBidangSelector";
import EmployeeSelector from "../EmployeeSelector";
import DropPointSelector from "../DropPointSelector";
import JudulPekerjaanSheet from "../JudulPekerjaanSheet";

export const DetailStepSheets = ({
  isSubBidangSheetVisible,
  isEmployeeSheetVisible,
  isDropPointSheetVisible,
  isJudulPekerjaanSheetVisible,
  onSubBidangClose,
  onEmployeeClose,
  onDropPointClose,
  onJudulPekerjaanClose,
  onSubBidangSelect,
  onEmployeeSelect,
  onDropPointSelect,
  onJudulPekerjaanSave,
}) => {
  if (
    !isSubBidangSheetVisible &&
    !isEmployeeSheetVisible &&
    !isDropPointSheetVisible &&
    !isJudulPekerjaanSheetVisible
  ) {
    return null;
  }

  return (
    <>
      {isSubBidangSheetVisible && (
        <SubBidangSelector
          isVisible={isSubBidangSheetVisible}
          onClose={onSubBidangClose}
          onSelect={onSubBidangSelect}
        />
      )}

      {isEmployeeSheetVisible && (
        <EmployeeSelector
          isVisible={isEmployeeSheetVisible}
          onClose={onEmployeeClose}
          onSelect={onEmployeeSelect}
        />
      )}

      {isDropPointSheetVisible && (
        <DropPointSelector
          isVisible={isDropPointSheetVisible}
          onClose={onDropPointClose}
          onSelect={onDropPointSelect}
        />
      )}

      {isJudulPekerjaanSheetVisible && (
        <JudulPekerjaanSheet
          isVisible={isJudulPekerjaanSheetVisible}
          onClose={onJudulPekerjaanClose}
          onSave={onJudulPekerjaanSave}
        />
      )}
    </>
  );
};
