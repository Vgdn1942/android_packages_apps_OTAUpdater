# Copyright 2007-2011 The Android Open Source Project
ifeq ($(strip $(OTAUPDATER_SUPPORT)), yes)
ifeq ($(strip $(AGOLD_BUILD_GMS)), yes)

LOCAL_PATH:= $(call my-dir)
include $(CLEAR_VARS)

LOCAL_MODULE_TAGS := optional

LOCAL_SRC_FILES := $(call all-java-files-under, src)

LOCAL_PACKAGE_NAME := OTAUpdater
LOCAL_CERTIFICATE := platform
LOCAL_PRIVILEGED_MODULE := true

# Builds against the public SDK
#LOCAL_SDK_VERSION := current

include $(BUILD_PACKAGE)

# This finds and builds the test apk as well, so a single make does both.
#include $(call all-makefiles-under,$(LOCAL_PATH))

endif
endif
