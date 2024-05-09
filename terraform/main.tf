terraform {
  required_providers {
    launchdarkly = {
      source  = "launchdarkly/launchdarkly"
    }
  }
}

variable "LAUNCHDARKLY_ACCESS_TOKEN" {
  type = string
}

provider "launchdarkly" {
  access_token = var.LAUNCHDARKLY_ACCESS_TOKEN
}

resource "launchdarkly_project" "Launch Airways" {
  key  = "ld-launch-airways"
  name = "ld-launch-airways"

  tags = [
    "terraform",
  ]

  environments {
        key   = "reactv21"
        name  = "reactv2-1"
        color = "7B42BC"
        tags  = ["terraform"]
  }
  default_client_side_availability {
    using_environment_id = true
    using_mobile_key     = false
  }
}

resource "launchdarkly_feature_flag" "qrcode" {
  project_key = launchdarkly_project.reactv2.key
  key         = "qrcode"
  name        = "0 - QR Code"
  description = "Scan the QR code in the application in order to access the demo locally!"

  variation_type = "boolean"
  variations {
    value       = "true"
    name        = "QR Code On"
    description = "Show the QR Code"
  }
  variations {
    value       = "false"
    name        = "QR Code Off"
    description = "Disable the QR Code for mobile device viewing "
  }
  
  defaults {
    on_variation = 0
    off_variation = 1
  }

  tags = [
    "terraform-managed"
  ]
}

resource "launchdarkly_feature_flag" "login" {
  project_key = launchdarkly_project.reactv2.key
  key         = "login"
  name        = "1 - APP UI (Release a New UI)"
  description = "Features can be text on screen, new web components, API changes, or new infrastructure entirely"

  variation_type = "boolean"
  variations {
    value       = "true"
    name        = "Show New Header Design"
    description = "Show the updated LaunchDarkly header"
  }
  variations {
    value       = "false"
    name        = "Show Old Header Design"
    description = "Displays header showing common app delivery "
  }
  
  defaults {
    on_variation = 0
    off_variation = 1
  }

  tags = [
    "terraform-managed",   
  ]
}

resource "launchdarkly_feature_flag" "bgstyle" {
  project_key = launchdarkly_project.reactv2.key
  key         = "bgstyle"
  name        = "2 - Background Styling (Targeting)"
  description = "We can control how features are released based on various targeting properties, like the coloring of a background image!"

  variation_type = "boolean"
  variations {
    value       = "true"
    name        = "Login enabled"
    description = "Login box presented"
  }
  variations {
    value       = "false"
    name        = "Login Disabled"
    description = "Not able to login "
  }
  
  defaults {
    on_variation = 0
    off_variation = 1
  }

  tags = [
    "terraform-managed",   
  ]
}

resource "launchdarkly_feature_flag" "apidebug" {
  project_key = launchdarkly_project.reactv2.key
  key         = "apidebug"
  name        = "3 - API Menu (Hide a debug menu)"
  description = "Features can be hidden behind debugging feature flags"

  variation_type = "boolean"
  variations {
    value       = "true"
    name        = "Enable Debug Menu"
    description = "Displays the hidden admin debugging menu for DB"
  }
  variations {
    value       = "false"
    name        = "No Debug Menu"
    description = "Disable the debug menu flag"
  }
  
  defaults {
    on_variation = 0
    off_variation = 1
  }

  tags = [
    "terraform-managed",   
  ]
}

resource "launchdarkly_feature_flag" "dbinfo" {
  project_key = launchdarkly_project.reactv2.key
  key         = "dbinfo"
  name        = "4 - Switch Database (Migration)"
  description = "Use feature flags to **migrate** to a new infrastructure service (like a **database**)"

  variation_type = "json"
  variations {
    value       = "{'dbhost': 'dynanmo','mode': 'cloud'}"
    name        = "Cloud"
    description = "Enable the Cloud hosted database"
  }
  variations {
    value       = "{'dbhost': 'db','mode': 'local'}"
    name        = "LocalDB"
    description = "Use local database"
  }
  
  defaults {
    on_variation = 0
    off_variation = 1
  }

  tags = [
    "terraform-managed",   
  ]
}

resource "launchdarkly_feature_flag" "cardshow" {
  project_key = launchdarkly_project.reactv2.key
  key         = "cardshow"
  name        = "5 - Release Cards"
  description = "This flag controls the visibility of the release cards on the bottom of the UI "

  variation_type = "boolean"
  variations {
    value       = "true"
    name        = "Show Release Cards"
    description = "Show the app delivery release cards"
  }
  variations {
    value       = "false"
    name        = "Disable Card Views"
    description = "Do not show the release cards "
  }
  
  defaults {
    on_variation = 0
    off_variation = 1
  }

  tags = [
    "terraform-managed",   
  ]
}

resource "launchdarkly_feature_flag" "upperimage" {
  project_key = launchdarkly_project.reactv2.key
  key         = "upperimage"
  name        = "3 - Upper Image"
  description = "Show the upper immage on page"

  variation_type = "boolean"
  variations {
    value       = "true"
    name        = "Show Image"
    description = "Display the image"
  }
  variations {
    value       = "false"
    name        = "Disable Image"
    description = "Disable the image from being viewed "
  }
  
  defaults {
    on_variation = 0
    off_variation = 1
  }

  tags = [
    "terraform-managed",   
  ]
}

output "LaunchDarkly_Server_Key" {
  value = launchdarkly_project.reactv2.environments[0].api_key
  sensitive = true
}

output "LaunchDarkly_Client_Side_Key" {
  value = launchdarkly_project.reactv2.environments[0].client_side_id
  sensitive = true
}
