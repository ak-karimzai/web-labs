name: Build and Test

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Set up Go
        uses: actions/setup-go@v2
        with:
          go-version: 1.21.5

      - name: Install Dependencies
        run: |
          go mod download

      - name: Test
        run: |
          go test ./...

      - name: Build
        run: |
          go build -o server ./cmd/web/main.go

  package:
    runs-on: ubuntu-latest

    needs: build

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Copy Build Artifacts
        run: |
          mkdir -p build
          cp server .env schema start.sh wait-for.sh build/
