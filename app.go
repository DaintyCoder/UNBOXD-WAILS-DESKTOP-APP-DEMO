package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) SaveQRCode(dataURL string, filename string) (string, error) {
	imageData, err := dataURLToBytes(dataURL)
	if err != nil {
		return "", fmt.Errorf("invalid data URL: %v", err)
	}

	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("failed to get user home directory: %v", err)
	}
	picturesDir := filepath.Join(homeDir, "Pictures", "QRCodes")

	if err := os.MkdirAll(picturesDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create directory: %v", err)
	}

	if filename == "" || !strings.HasSuffix(strings.ToLower(filename), ".png") {
		filename = fmt.Sprintf("qrcode-%d.png", time.Now().Unix())
	}

	fullPath := filepath.Join(picturesDir, filename)
	if err := os.WriteFile(fullPath, imageData, 0644); err != nil {
		return "", fmt.Errorf("failed to write file: %v", err)
	}

	return fullPath, nil
}

func dataURLToBytes(dataURL string) ([]byte, error) {
	parts := strings.Split(dataURL, ",")
	if len(parts) != 2 {
		return nil, fmt.Errorf("invalid data URL format")
	}
	if !strings.Contains(parts[0], ";base64") {
		return nil, fmt.Errorf("data URL is not base64 encoded")
	}
	return base64.StdEncoding.DecodeString(parts[1])
}
