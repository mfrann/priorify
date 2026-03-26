import type { ReactNode } from "react";
import { forwardRef } from "react";
import { StyleSheet } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import type {
  BottomSheetBackdropProps,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet";

interface TaskSheetProps
  extends Pick<BottomSheetModalProps, "snapPoints"> {
  children: ReactNode;
  onClose?: () => void;
}

const DEFAULT_SNAP_POINTS = ["60%", "60%"];

export const TaskSheet = forwardRef<
  BottomSheetModal,
  TaskSheetProps
>(({ children, snapPoints = DEFAULT_SNAP_POINTS, onClose }, ref) => {
  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
    />
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.background}
      onDismiss={onClose}
      enableDynamicSizing={false}
    >
      {children}
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    backgroundColor: "#ddd",
    width: 40,
    height: 4,
  },
});
