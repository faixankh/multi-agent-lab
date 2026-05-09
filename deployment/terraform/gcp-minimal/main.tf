terraform {
  required_providers {
    google = { source = "hashicorp/google", version = "~> 5.0" }
  }
}

variable "project_id" { type = string }
variable "region" { type = string  default = "asia-south1" }

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_compute_network" "agentos" {
  name                    = "agentos-network"
  auto_create_subnetworks = true
}
