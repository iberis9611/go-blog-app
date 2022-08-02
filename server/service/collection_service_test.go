package service_test

import (
	"testing"

	"github.com/iberis9611/go-blog-application/service"
)

func TestGetSavedStatus(t *testing.T) {
	aid := "art-f027a570-6084-40d9-8412-aa860aae6faa"
	uuid := "693588e1-5265-422a-ade4-256370f8b088"
	status, err := service.GetSavedStatus(aid, uuid)
	if err != nil {
		t.Logf("%v\n", err)
		return
	}
	t.Logf("%d\n", status)
}

func TestSave(t *testing.T) {
	aid := "art-f027a570-6084-40d9-8412-aa860aae6faa"
	uuid := "a5ed1143-a3c1-4c0b-9722-7dbfc78583e9"
	err := service.Save(aid, uuid)
	if err != nil {
		t.Logf("%v\n", err)
		return
	}
	t.Log("收藏成功")
}

/*
SELECT article_saved FROM users WHERE id=4;
SELECT * FROM collections WHERE article_id='art-f027a570-6084-40d9-8412-aa860aae6faa' AND user_id=4;
*/

// go clean -testcache // Delete all cached test results
